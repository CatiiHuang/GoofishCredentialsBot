/**
 * HTTP 请求工具
 * 基于 Angular HttpClient，提供简化的 API
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { API_BASE } from '../constants/api.constants';
import { DialogService } from '../../shared/dialog/dialog.service';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialogService = inject(DialogService);

  /**
   * 处理 HTTP 错误
   */
  private handleError(error: HttpErrorResponse) {
    // 处理 401 未授权错误
    if (error.status === 401) {
      // 显示登录提醒弹窗
      this.dialogService
        .confirm('登录过期', '您的登录状态已过期，请重新登录', '去登录', '取消')
        .then((confirmed) => {
          if (confirmed) {
            // 跳转到登录页面，并携带当前路径作为返回地址
            const currentUrl = this.router.url;
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: currentUrl },
            });
          }
        });
    }
    return throwError(() => error);
  }

  // 获取请求头配置
  private getRequestOptions() {
    const ticket = localStorage.getItem('ticket');
    const headers: Record<string, string> = {};
    
    if (ticket) {
      headers['ticket'] = ticket;
    }
    
    return { headers };
  }

  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    
    const options = this.getRequestOptions();
    
    return firstValueFrom(
      this.http
        .get<T>(`${API_BASE}${path}`, { 
          params: httpParams,
          headers: options.headers
        })
        .pipe(catchError(this.handleError.bind(this)))
    );
  }

  post<T>(path: string, body?: any) {
    const options = this.getRequestOptions();
    
    return firstValueFrom(
      this.http
        .post<T>(`${API_BASE}${path}`, body ?? {}, {
          headers: options.headers
        })
        .pipe(catchError(this.handleError.bind(this)))
    );
  }

  put<T>(path: string, body?: any) {
    const options = this.getRequestOptions();
    
    return firstValueFrom(
      this.http
        .put<T>(`${API_BASE}${path}`, body ?? {}, {
          headers: options.headers
        })
        .pipe(catchError(this.handleError.bind(this)))
    );
  }

  delete<T>(path: string) {
    const options = this.getRequestOptions();
    
    return firstValueFrom(
      this.http.delete<T>(`${API_BASE}${path}`, {
        headers: options.headers
      }).pipe(catchError(this.handleError.bind(this)))
    );
  }
}
