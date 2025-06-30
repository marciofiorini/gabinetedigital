
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private maxLogs = 1000;
  private logs: LogEntry[] = [];

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      // Try to get user ID from localStorage or session
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch {
      // Silently fail
    }
    return undefined;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  private addToHistory(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  debug(message: string, data?: any) {
    const entry = this.createLogEntry('debug', message, data);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    this.addToHistory(entry);
    
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, data?: any) {
    const entry = this.createLogEntry('error', message, data);
    this.addToHistory(entry);
    
    console.error(`[ERROR] ${message}`, data);
    
    // In production, you might want to send errors to a monitoring service
    if (!this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // In a real application, send to your monitoring service
      // For now, we'll just store it in IndexedDB for later retrieval
      this.storeInIndexedDB(entry);
    } catch (error) {
      // Silently fail - monitoring shouldn't break the app
    }
  }

  private async storeInIndexedDB(entry: LogEntry) {
    try {
      const request = indexedDB.open('ErrorLogs', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('logs')) {
          db.createObjectStore('logs', { keyPath: 'timestamp' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['logs'], 'readwrite');
        const store = transaction.objectStore('logs');
        store.add(entry);
      };
    } catch (error) {
      // Silently fail
    }
  }

  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Replace console.log usage in development
if (import.meta.env.DEV) {
  (window as any).logger = logger;
}
