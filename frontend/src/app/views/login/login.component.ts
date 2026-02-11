import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 表单数据
  username = signal('');
  password = signal('');

  // 错误信息
  errorMessage = signal('');
  loading = signal(false);

  // 生成MD5哈希
  private generateMd5(str: string): string {
    return CryptoJS.MD5(str).toString();
  }

  // 存储到localStorage
  private setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  // 登录方法
  login() {
    this.errorMessage.set('');
    this.loading.set(true);

    try {
      // 生成MD5哈希
      const md5Hash = this.generateMd5(`${this.username()}:${this.password()}`);
      console.log('MD5哈希:', md5Hash);

      // 存储到localStorage中
      this.setLocalStorage('ticket', md5Hash);

      // 模拟登录成功
      setTimeout(() => {
        this.loading.set(false);
        // 获取返回地址
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        // 跳转到返回地址
        this.router.navigateByUrl(returnUrl);
      }, 1000);
    } catch (error) {
      this.loading.set(false);
      this.errorMessage.set('登录失败，请检查用户名和密码');
      console.error('登录错误:', error);
    }
  }

  // 重置表单
  reset() {
    this.username.set('');
    this.password.set('');
    this.errorMessage.set('');
  }
}
