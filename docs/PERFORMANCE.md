# Performance Guide

> Complete performance optimization guide for @logistically/i18n-cli

## 📖 Table of Contents

1. [Overview](#overview)
2. [Performance Features](#performance-features)
3. [Optimization Techniques](#optimization-techniques)
4. [Monitoring & Metrics](#monitoring--metrics)
5. [Concurrent Processing](#concurrent-processing)
6. [Memory Management](#memory-management)
7. [File Size Optimization](#file-size-optimization)
8. [Best Practices](#best-practices)
9. [Performance Testing](#performance-testing)

## 🚀 Overview

The CLI is designed for high-performance processing of large codebases with enterprise-grade optimization features. Performance is optimized at every level, from concurrent file processing to memory management.

## ⚡ Performance Features

### Core Performance Components

1. **Concurrent Processing** - Parallel file processing for maximum throughput
2. **Memory Management** - Efficient memory usage with automatic cleanup
3. **File Size Filtering** - Skip large files to maintain performance
4. **Progress Tracking** - Real-time progress monitoring with ETA
5. **Performance Metrics** - Detailed performance analytics
6. **Batch Processing** - Process files in optimized batches

### Performance Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Input Queue   │───▶│  Worker Pool    │───▶│  Output Queue   │
│                 │    │  (Concurrent)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  File Filter    │    │  Memory Pool    │    │  Progress Bar   │
│  (Size/Type)    │    │  (Optimized)    │    │  (Real-time)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Optimization Techniques

### 1. Concurrent File Processing

Process multiple files simultaneously for maximum throughput.

```bash
# Process 8 files concurrently
i18n extract --concurrency 8

# Environment variable
MAX_CONCURRENCY=8 i18n extract

# Auto-detect optimal concurrency
i18n extract --auto-concurrency
```

#### Concurrency Optimization

```typescript
// Optimal concurrency based on CPU cores
const optimalConcurrency = Math.min(
  require('os').cpus().length,
  maxConcurrency
);

// Process files in batches
const batchSize = optimalConcurrency;
for (let i = 0; i < files.length; i += batchSize) {
  const batch = files.slice(i, i + batchSize);
  await Promise.allSettled(batch.map(processFile));
}
```

### 2. File Size Filtering

Skip files that are too large to process efficiently.

```bash
# Skip files larger than 50MB
i18n extract --max-file-size 50

# Environment variable
MAX_FILE_SIZE=50 i18n extract

# Auto-skip large files
i18n extract --auto-skip-large
```

#### File Size Optimization

```typescript
// Check file size before processing
const fileSize = await getFileSize(filePath);
const maxSize = config.performance.maxFileSize * 1024 * 1024; // MB to bytes

if (fileSize > maxSize) {
  logger.warning(`Skipping large file: ${filePath} (${fileSize} bytes)`);
  return;
}
```

### 3. Memory Management

Efficient memory usage with automatic cleanup.

```bash
# Enable memory monitoring
i18n extract --monitor-memory

# Set memory limits
i18n extract --max-memory 512

# Environment variable
MAX_MEMORY=512 i18n extract
```

#### Memory Optimization

```typescript
// Monitor memory usage
const memoryUsage = process.memoryUsage();
const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;

if (heapUsedMB > maxMemoryMB) {
  logger.warning(`High memory usage: ${heapUsedMB.toFixed(2)}MB`);
  // Trigger garbage collection or reduce concurrency
}
```

### 4. Progress Tracking

Real-time progress monitoring with speed and ETA.

```bash
# Enable progress bar
i18n extract --progress-bar

# Environment variable
ENABLE_PROGRESS_BAR=true i18n extract

# Show detailed progress
i18n extract --progress-details
```

#### Progress Optimization

```typescript
// Update progress in real-time
const updateProgress = (current: number, total: number) => {
  const percentage = Math.round((current / total) * 100);
  const speed = current / (Date.now() - startTime) * 1000; // files/sec
  const eta = (total - current) / speed; // seconds

  logger.progress(`${current}/${total} (${percentage}%) - Speed: ${speed.toFixed(2)} files/sec - ETA: ${eta.toFixed(0)}s`);
};
```

## 📊 Monitoring & Metrics

### Performance Metrics

Track detailed performance metrics:

```bash
# Enable performance monitoring
i18n extract --monitor-performance

# View performance report
i18n extract --performance-report

# Export performance data
i18n extract --export-performance
```

#### Metrics Collection

```typescript
interface PerformanceMetrics {
  duration: number;               // Duration in milliseconds
  filesProcessed: number;         // Number of files processed
  totalKeys: number;              // Total keys extracted
  memoryUsage: number;            // Memory usage in MB
  cpuUsage: number;               // CPU usage in seconds
  speed: number;                  // Files per second
  eta: number;                    // Estimated time remaining
}
```

### Real-time Monitoring

Monitor performance in real-time:

```bash
# Start performance monitoring
i18n extract --monitor-performance --dashboard

# View performance events
i18n extract --performance-events

# Generate performance report
i18n extract --performance-report --format json
```

#### Monitoring Dashboard

```typescript
// Performance dashboard
const dashboard = {
  current: {
    filesProcessed: 25,
    keysExtracted: 150,
    memoryUsage: 45.2,
    speed: 2.5
  },
  total: {
    files: 100,
    keys: 500,
    duration: 120000
  },
  performance: {
    efficiency: 85.5,
    throughput: 2.5,
    memoryEfficiency: 90.2
  }
};
```

## 🔄 Concurrent Processing

### Worker Pool Management

Efficient worker pool for concurrent processing:

```typescript
// Create worker pool
const workerPool = new WorkerPool({
  size: config.performance.maxConcurrency,
  timeout: config.performance.timeout
});

// Process files concurrently
const results = await workerPool.process(files, async (file) => {
  return await processFile(file);
});
```

### Batch Processing

Process files in optimized batches:

```typescript
// Process files in batches
const batchSize = Math.min(concurrency, 10);
const batches = chunk(files, batchSize);

for (const batch of batches) {
  const batchResults = await Promise.allSettled(
    batch.map(file => processFile(file))
  );
  
  // Update progress
  updateProgress(processedFiles, totalFiles);
}
```

### Concurrency Optimization

Optimize concurrency based on system resources:

```typescript
// Calculate optimal concurrency
const calculateOptimalConcurrency = () => {
  const cpuCores = require('os').cpus().length;
  const memoryGB = require('os').totalmem() / 1024 / 1024 / 1024;
  
  // Base concurrency on CPU cores
  let optimal = cpuCores;
  
  // Adjust based on available memory
  if (memoryGB < 4) optimal = Math.min(optimal, 2);
  if (memoryGB < 8) optimal = Math.min(optimal, 4);
  
  return Math.min(optimal, 20); // Max 20 concurrent processes
};
```

## 💾 Memory Management

### Memory Pool

Efficient memory pool for file processing:

```typescript
// Memory pool for file content
class MemoryPool {
  private pool: Buffer[] = [];
  private maxSize: number;
  
  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }
  
  acquire(size: number): Buffer {
    const buffer = this.pool.find(b => b.length >= size);
    if (buffer) {
      this.pool = this.pool.filter(b => b !== buffer);
      return buffer;
    }
    return Buffer.alloc(size);
  }
  
  release(buffer: Buffer): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(buffer);
    }
  }
}
```

### Garbage Collection

Automatic garbage collection for memory optimization:

```typescript
// Trigger garbage collection when memory usage is high
const checkMemoryUsage = () => {
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
  
  if (heapUsedMB > config.performance.maxMemory * 0.8) {
    if (global.gc) {
      global.gc();
      logger.debug('Garbage collection triggered', 'performance');
    }
  }
};
```

### Memory Monitoring

Monitor memory usage in real-time:

```typescript
// Memory monitoring
const monitorMemory = () => {
  const memoryUsage = process.memoryUsage();
  
  return {
    heapUsed: memoryUsage.heapUsed / 1024 / 1024,
    heapTotal: memoryUsage.heapTotal / 1024 / 1024,
    external: memoryUsage.external / 1024 / 1024,
    rss: memoryUsage.rss / 1024 / 1024
  };
};
```

## 📁 File Size Optimization

### File Size Filtering

Skip files that are too large to process efficiently:

```typescript
// File size filtering
const shouldProcessFile = async (filePath: string): Promise<boolean> => {
  try {
    const stats = await fs.stat(filePath);
    const fileSizeMB = stats.size / 1024 / 1024;
    
    if (fileSizeMB > config.performance.maxFileSize) {
      logger.warning(`Skipping large file: ${filePath} (${fileSizeMB.toFixed(2)}MB)`);
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error(`Error checking file size: ${filePath}`, 'performance');
    return false;
  }
};
```

### Large File Handling

Handle large files efficiently:

```typescript
// Stream processing for large files
const processLargeFile = async (filePath: string): Promise<TranslationKey[]> => {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const chunks: string[] = [];
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    stream.on('end', () => {
      const content = chunks.join('');
      const keys = extractKeys(content);
      resolve(keys);
    });
    
    stream.on('error', reject);
  });
};
```

## 🏆 Best Practices

### 1. Optimize Concurrency

Set optimal concurrency based on your system:

```bash
# For high-performance systems
i18n extract --concurrency 16

# For memory-constrained systems
i18n extract --concurrency 2

# Auto-detect optimal settings
i18n extract --auto-optimize
```

### 2. Monitor Performance

Always monitor performance in production:

```bash
# Enable performance monitoring
i18n extract --monitor-performance --log-performance

# Set performance alerts
i18n extract --performance-alerts --alert-threshold 80
```

### 3. Optimize File Processing

Optimize file processing for your use case:

```bash
# Skip large files
i18n extract --max-file-size 25

# Process specific file types
i18n extract --patterns "*.ts,*.js" --ignore "*.min.js"

# Use batch processing
i18n extract --batch-size 100
```

### 4. Memory Optimization

Optimize memory usage for large projects:

```bash
# Set memory limits
i18n extract --max-memory 512

# Enable memory monitoring
i18n extract --monitor-memory --memory-alerts

# Use streaming for large files
i18n extract --stream-large-files
```

### 5. Progress Tracking

Use progress tracking for better user experience:

```bash
# Enable progress bar
i18n extract --progress-bar

# Show detailed progress
i18n extract --progress-details --show-speed --show-eta

# Log progress to file
i18n extract --log-progress --progress-file progress.log
```

## 🧪 Performance Testing

### Performance Test Suite

Run comprehensive performance tests:

```bash
# Run performance tests
npm run performance:test

# Benchmark different configurations
npm run performance:benchmark

# Test with large datasets
npm run performance:stress-test
```

### Performance Benchmarking

Benchmark different configurations:

```bash
# Benchmark concurrency settings
i18n extract --benchmark-concurrency

# Benchmark file size limits
i18n extract --benchmark-file-size

# Benchmark memory usage
i18n extract --benchmark-memory
```

### Performance Profiling

Profile performance for optimization:

```bash
# Enable performance profiling
i18n extract --profile-performance

# Generate performance profile
i18n extract --performance-profile

# Analyze performance bottlenecks
i18n extract --analyze-performance
```

## 📈 Performance Metrics

### Key Performance Indicators

Track these key metrics:

1. **Throughput** - Files processed per second
2. **Memory Efficiency** - Memory usage per file
3. **CPU Utilization** - CPU usage during processing
4. **I/O Performance** - File read/write performance
5. **Concurrency Efficiency** - Optimal concurrency level

### Performance Reporting

Generate detailed performance reports:

```bash
# Generate performance report
i18n extract --performance-report --format json

# Export performance data
i18n extract --export-performance --output performance.json

# Create performance dashboard
i18n extract --performance-dashboard --port 3000
```

### Performance Alerts

Set up performance alerts:

```bash
# Set performance thresholds
i18n extract --performance-thresholds "throughput:10,memory:80,cpu:90"

# Enable performance alerts
i18n extract --performance-alerts --alert-email performance@company.com

# Performance monitoring
i18n extract --monitor-performance --alert-on-threshold
```

## 🔧 Performance Configuration

### Environment Variables

```bash
# Performance environment variables
export MAX_CONCURRENCY=8
export MAX_FILE_SIZE=50
export MAX_MEMORY=512
export TIMEOUT=600
export ENABLE_PROGRESS_BAR=true
export MONITOR_PERFORMANCE=true
```

### Configuration File

```json
{
  "performance": {
    "maxConcurrency": 8,
    "maxFileSize": 50,
    "maxMemory": 512,
    "timeout": 600,
    "enableProgressBar": true,
    "monitorPerformance": true,
    "autoOptimize": true,
    "batchSize": 100
  }
}
```

### Command Line Options

```bash
# Performance options
i18n extract --concurrency 8 --max-file-size 50 --max-memory 512

# Monitoring options
i18n extract --monitor-performance --progress-bar --performance-report

# Optimization options
i18n extract --auto-optimize --stream-large-files --batch-processing
```

---

**For more information, see the [User Guide](./USER_GUIDE.md) or [Configuration Guide](./CONFIGURATION.md).** 