import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    getItem(key: string): string | null {
        if (this.isBrowser && typeof localStorage !== 'undefined') {
            return localStorage.getItem(key) || null;
        }
        return null;
    }

    setItem(key: string, value: string): void {
        if (this.isBrowser && typeof localStorage !== 'undefined') {
            localStorage.setItem(key, value);
        }
    }

    removeItem(key: string): void {
        if (this.isBrowser && typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        }
    }

    clear(): void {
        if (this.isBrowser && typeof localStorage !== 'undefined') {
            localStorage.clear();
        }
    }
}