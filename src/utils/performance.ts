import { PerformanceMetrics, ProgressOptions, ProgressUpdate } from '../types';
import { Logger } from './logger';

export class PerformanceMonitor {
  private logger = Logger.getInstance();
  private startTime: number = 0;
  private metrics: PerformanceMetrics | null = null;
  private progressCallbacks: ((update: ProgressUpdate) => void)[] = [];

  startMonitoring(): void {
    this.startTime = Date.now();
    this.metrics = {
      startTime: this.startTime,
      endTime: 0,
      duration: 0,
      filesProcessed: 0,
      totalKeys: 0,
      memoryUsage: 0,
      cpuUsage: 0,
    };
  }

  endMonitoring(): PerformanceMetrics {
    if (!this.metrics) {
      throw new Error('Performance monitoring not started');
    }

    this.metrics.endTime = Date.now();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
    this.metrics.memoryUsage = this.getMemoryUsage();
    this.metrics.cpuUsage = this.getCpuUsage();

    return this.metrics;
  }

  updateProgress(current: number, total: number, status: 'processing' | 'completed' | 'error' = 'processing'): void {
    if (!this.metrics) return;

    this.metrics.filesProcessed = current;
    
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const speed = this.calculateSpeed(current);
    const eta = this.calculateETA(current, total, speed);

    const update: ProgressUpdate = {
      current,
      total,
      percentage,
      speed,
      eta,
      status,
    };

    // Notify progress callbacks
    this.progressCallbacks.forEach(callback => callback(update));

    // Log progress if verbose
    if (this.logger) {
      this.logger.debug(`Progress: ${current}/${total} (${percentage}%) - Speed: ${speed?.toFixed(2)} files/sec`);
    }
  }

  updateKeysProcessed(count: number): void {
    if (this.metrics) {
      this.metrics.totalKeys = count;
    }
  }

  onProgress(callback: (update: ProgressUpdate) => void): void {
    this.progressCallbacks.push(callback);
  }

  removeProgressCallback(callback: (update: ProgressUpdate) => void): void {
    const index = this.progressCallbacks.indexOf(callback);
    if (index > -1) {
      this.progressCallbacks.splice(index, 1);
    }
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return usage.heapUsed / 1024 / 1024; // Convert to MB
    }
    return 0;
  }

  private getCpuUsage(): number {
    // Simple CPU usage estimation based on time
    if (this.metrics) {
      const duration = this.metrics.endTime - this.metrics.startTime;
      return duration / 1000; // Convert to seconds
    }
    return 0;
  }

  private calculateSpeed(current: number): number | undefined {
    if (!this.metrics || current === 0) return undefined;

    const elapsed = (Date.now() - this.metrics.startTime) / 1000; // seconds
    return elapsed > 0 ? current / elapsed : undefined;
  }

  private calculateETA(current: number, total: number, speed?: number): number | undefined {
    if (!speed || current >= total) return undefined;

    const remaining = total - current;
    return remaining / speed; // seconds
  }

  logMetrics(): void {
    if (!this.metrics) return;

    this.logger.section('Performance Metrics');
    this.logger.info(`Duration: ${this.metrics.duration}ms`);
    this.logger.info(`Files Processed: ${this.metrics.filesProcessed}`);
    this.logger.info(`Total Keys: ${this.metrics.totalKeys}`);
    this.logger.info(`Memory Usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
    this.logger.info(`CPU Usage: ${this.metrics.cpuUsage.toFixed(2)}s`);

    if (this.metrics.duration > 0) {
      const keysPerSecond = (this.metrics.totalKeys / this.metrics.duration) * 1000;
      const filesPerSecond = (this.metrics.filesProcessed / this.metrics.duration) * 1000;
      
      this.logger.info(`Processing Speed: ${keysPerSecond.toFixed(2)} keys/sec`);
      this.logger.info(`File Processing Speed: ${filesPerSecond.toFixed(2)} files/sec`);
    }
  }

  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  reset(): void {
    this.startTime = 0;
    this.metrics = null;
    this.progressCallbacks = [];
  }
}

export class ProgressBar {
  private logger = Logger.getInstance();
  private current = 0;
  private total = 0;
  private startTime = 0;
  private lastUpdate = 0;
  private barLength = 50;

  constructor(private options: ProgressOptions) {
    this.total = options.total;
    this.startTime = Date.now();
  }

  update(current: number): void {
    this.current = current;
    const now = Date.now();
    
    // Throttle updates to avoid spam
    if (now - this.lastUpdate < 100) return;
    this.lastUpdate = now;

    this.render();
  }

  complete(): void {
    this.current = this.total;
    this.render();
    console.log(); // New line after progress bar
  }

  private render(): void {
    const percentage = this.total > 0 ? (this.current / this.total) * 100 : 0;
    const filledLength = Math.round((this.barLength * this.current) / this.total);
    const emptyLength = this.barLength - filledLength;

    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);
    const bar = filled + empty;

    const elapsed = Date.now() - this.startTime;
    const speed = elapsed > 0 ? (this.current / elapsed) * 1000 : 0;
    const eta = speed > 0 ? (this.total - this.current) / speed : 0;

    let status = `${this.current}/${this.total}`;
    
    if (this.options.showPercentage) {
      status += ` (${percentage.toFixed(1)}%)`;
    }
    
    if (this.options.showSpeed) {
      status += ` - ${speed.toFixed(2)}/s`;
    }
    
    if (this.options.showETA && eta > 0) {
      status += ` - ETA: ${this.formatTime(eta)}`;
    }

    // Clear line and render progress bar
    process.stdout.write('\r');
    process.stdout.write(`${this.options.title}: ${bar} ${status}`);
  }

  private formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else {
      return `${Math.round(seconds / 3600)}h`;
    }
  }
} 