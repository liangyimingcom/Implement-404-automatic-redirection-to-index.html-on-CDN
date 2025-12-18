# 快速开始指南 - 中文语言支持

## 🚀 5 分钟快速上手

### 1. 查看项目文件

```bash
# 查看所有文件
ls -lh

# 运行中文字符测试
python3 test-chinese-support.py
```

### 2. 核心文件说明

| 文件 | 用途 | 说明 |
|------|------|------|
| `index.js` | Lambda@Edge 函数 | 部署到 AWS Lambda，含详细中文注释 |
| `index.html` | 静态重定向页面 | 上传到 S3 或 Web 服务器 |
| `index.php` | 动态重定向页面 | 上传到 PHP 服务器 |
| `404.html` | 错误页面 | 配置为自定义 404 页面 |

### 3. 快速部署步骤

#### 步骤 1: 部署 Lambda@Edge 函数
```javascript
// 复制 index.js 中的代码到 AWS Lambda
// 区域：us-east-1
// 运行时：Node.js 24.x
```

#### 步骤 2: 上传网页文件
```bash
# HTML 版本（静态网站）
aws s3 cp index.html s3://your-bucket/

# PHP 版本（动态网站）
scp index.php user@server:/var/www/html/
```

#### 步骤 3: 配置 CloudFront
- 在 CloudFront 中关联 Lambda@Edge 函数
- 选择 "源响应" (Origin Response) 事件
- 等待部署完成（约 10-20 分钟）

#### 步骤 4: 测试验证
```bash
# 访问不存在的页面
curl -I https://your-domain.cloudfront.net/test123

# 应该返回 302 重定向
```

### 4. 中文支持特性

✅ **已实现的功能**：
- 完整的中文代码注释
- 中文用户界面
- 中文错误消息
- 中文文档
- UTF-8 编码支持
- 中文 URL 路径支持

### 5. 常用命令

```bash
# 测试中文字符编码
python3 test-chinese-support.py

# 查看文件编码
file -b --mime-encoding index.html

# 统计中文字符数
grep -o "[\u4e00-\u9fa5]" index.html | wc -l
```

### 6. 文档导航

| 文档 | 内容 |
|------|------|
| `README.md` | 完整的部署指南（原有） |
| `README_CN.md` | 详细的技术文档（新增） |
| `CHINESE_SUPPORT_SUMMARY.md` | 中文支持总结 |
| `IMPLEMENTATION_REPORT.txt` | 实施报告 |

### 7. 问题排查

#### 中文显示乱码？
```bash
# 检查文件编码
python3 test-chinese-support.py

# 确保浏览器字符集为 UTF-8
# 查看 HTML: <meta charset="UTF-8">
# 查看 PHP: header('Content-Type: text/html; charset=utf-8');
```

#### 重定向不生效？
1. 检查 Lambda@Edge 函数是否正确部署
2. 确认 CloudFront 分配状态为 "已部署"
3. 查看 CloudWatch 日志
4. 参考 README_CN.md 的问题排查章节

### 8. 技术支持

- **详细文档**：查看 `README_CN.md`
- **GitHub**：提交 Issue
- **作者**：liangyimingcom

### 9. 版本信息

- **当前版本**：v2.0.0
- **发布日期**：2025-12-18
- **主要更新**：完整的中文语言支持

---

## 📝 快速参考

### Lambda@Edge 函数（简化版）
```javascript
exports.handler = async (event) => {
    const response = event.Records[0].cf.response;
    if (response.status === '404') {
        response.status = '302';
        response.headers.location = [{ key: 'Location', value: '/index.php' }];
    }
    return response;
};
```

### HTML 页面（最小示例）
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>重定向成功</title>
</head>
<body>
    <h1>404 重定向功能正常！</h1>
    <p>您已被自动重定向到此页面。</p>
</body>
</html>
```

### PHP 页面（最小示例）
```php
<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>重定向成功</title>
</head>
<body>
    <h1>404 重定向功能正常！</h1>
    <p>当前时间：<?php echo date('Y-m-d H:i:s'); ?></p>
</body>
</html>
```

---

## ✅ 检查清单

部署前请确认：

- [ ] AWS Lambda 函数已创建（us-east-1 区域）
- [ ] 运行时选择 Node.js 24.x
- [ ] IAM 角色包含 edgelambda.amazonaws.com 信任关系
- [ ] Lambda 函数已发布版本（不是 $LATEST）
- [ ] 已关联到 CloudFront 的 "源响应" 事件
- [ ] index.html 或 index.php 已上传到源服务器
- [ ] 404.html 已配置为自定义错误响应（可选）
- [ ] 所有文件使用 UTF-8 编码
- [ ] CloudFront 分配状态为 "已部署"

---

## 🎯 成功标志

部署成功后，您应该看到：

✅ 访问不存在的页面会自动重定向到 /index.php 或 /index.html  
✅ 浏览器地址栏 URL 会改变  
✅ 不会显示 404 错误页面  
✅ 中文字符显示正常  
✅ 响应头包含 `Location: /index.php`  

---

**祝您部署顺利！** 🎉

如有问题，请查看完整文档 `README_CN.md` 或提交 GitHub Issue。
