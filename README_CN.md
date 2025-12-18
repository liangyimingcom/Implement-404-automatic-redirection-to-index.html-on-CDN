# CloudFront 404 自动重定向到 index.html - 完整中文文档

## 📖 项目简介

本项目提供了一个完整的解决方案，用于在 AWS CloudFront CDN 上实现 404 错误自动重定向到 /index.php 或 /index.html 页面。该方案使用 Lambda@Edge 技术，在 CloudFront 边缘位置拦截 404 响应，并将其转换为 302 重定向，从而为用户提供更好的体验。

### 🌟 主要特性

- ✅ **全球边缘部署**：Lambda@Edge 在全球 CloudFront 边缘位置执行，响应速度快
- ✅ **完整中文支持**：所有文档、代码注释、错误消息均支持中文
- ✅ **UTF-8 编码**：确保中文字符在所有环境下正确显示
- ✅ **自动重定向**：无缝处理 404 错误，用户无感知
- ✅ **灵活配置**：可轻松修改重定向目标和规则
- ✅ **详细日志**：CloudWatch 记录所有操作，便于监控和调试

## 📁 项目文件说明

### 核心文件

| 文件名 | 说明 | 语言 |
|--------|------|------|
| `index.js` | Lambda@Edge 函数代码（含详细中文注释） | 中文 |
| `index.html` | 重定向目标页面（HTML 版本） | 中文 |
| `index.php` | 重定向目标页面（PHP 版本） | 中文 |
| `404.html` | 备用 404 错误页面 | 中文 |
| `README.md` | 项目主文档（中文） | 中文 |
| `README_CN.md` | 详细中文文档（本文档） | 中文 |

### 文档特点

所有文档和代码文件都：
- 使用 UTF-8 编码，确保中文正确显示
- 提供详细的中文说明和注释
- 包含中文用户界面和错误消息
- 支持中文路径和 URL

## 🚀 快速开始

### 前提条件

1. **AWS 账户**：已有 AWS 账户并可以访问 AWS 管理控制台
2. **CloudFront 分配**：已创建 CloudFront 分配用于内容分发
3. **权限要求**：
   - Lambda 函数创建和管理权限
   - IAM 角色编辑权限
   - CloudFront 配置修改权限
4. **技术要求**：
   - 基本了解 CloudFront 和 Lambda 服务
   - Node.js 24.x 运行环境知识

### 实施步骤概览

1. **创建 Lambda 函数**（必须在 us-east-1 区域）
2. **配置 IAM 角色**（添加 Lambda@Edge 信任关系）
3. **发布函数版本**（Lambda@Edge 需要版本化的函数）
4. **关联到 CloudFront**（配置源响应触发器）
5. **测试验证**（确认重定向功能正常工作）

详细操作步骤请参考主 README.md 文档。

## 🔧 Lambda@Edge 函数详解

### 函数代码结构

```javascript
exports.handler = async (event) => {
    // 获取 CloudFront 响应对象
    const response = event.Records[0].cf.response;

    // 检测 404 状态码
    if (response.status === '404') {
        // 转换为 302 重定向
        response.status = '302';
        response.statusDescription = 'Found';
        
        // 清理现有 location 头部
        if (response.headers['location']) {
            delete response.headers.location;
        }
        
        // 设置新的重定向目标
        response.headers.location = [{
            key: 'Location',
            value: '/index.php'
        }];
    }

    return response;
};
```

### 工作原理

1. **触发时机**：当源服务器返回 404 响应时触发
2. **执行位置**：在 CloudFront 边缘位置（全球分布）
3. **处理过程**：
   - 拦截 404 响应
   - 修改状态码为 302
   - 添加 Location 头部
   - 返回修改后的响应
4. **用户体验**：浏览器自动跳转，用户无感知

### 可配置选项

您可以根据需要修改以下内容：

```javascript
// 修改重定向目标
value: '/index.php'  // 改为 '/index.html' 或其他页面

// 修改重定向类型
response.status = '302';  // 临时重定向
// 或
response.status = '301';  // 永久重定向
```

## 🌐 中文支持实现

### UTF-8 编码配置

所有文件都使用 UTF-8 编码，确保中文字符正确显示：

#### HTML 文件
```html
<meta charset="UTF-8">
```

#### PHP 文件
```php
<?php
header('Content-Type: text/html; charset=utf-8');
?>
```

#### JavaScript 文件
```javascript
// 文件保存为 UTF-8 编码
// 所有中文注释都能正确显示
```

### 中文字符测试

项目包含完整的中文字符测试，涵盖：

- ✅ 简体中文：你好世界
- ✅ 繁体中文：妳好世界
- ✅ 中文标点：，。！？；：
- ✅ 中文符号：""''（）【】《》
- ✅ 中文数字：一二三四五六七八九十
- ✅ 特殊字符：©®™℃℉€¥£

### 中文路径支持

系统支持 URL 中的中文路径：

```
https://example.cloudfront.net/测试页面
https://example.cloudfront.net/中文目录/文件.html
```

## 📋 文件使用说明

### index.js - Lambda 函数

**用途**：部署到 AWS Lambda@Edge 的核心函数代码

**特点**：
- 完整的中文注释
- 详细的功能说明
- 清晰的代码结构
- 易于理解和维护

**部署方法**：
1. 将代码复制到 Lambda 函数编辑器
2. 或上传为 .zip 文件
3. 确保运行时选择 Node.js 24.x

### index.html - HTML 重定向页面

**用途**：静态网站的重定向目标页面

**特点**：
- 现代化的响应式设计
- 完整的中文界面
- 功能演示和说明
- 交互式测试链接

**部署方法**：
- 上传到 CloudFront 源（S3 或自定义源）
- 确保文件路径为 `/index.html`
- 设置正确的 Content-Type: text/html; charset=utf-8

### index.php - PHP 重定向页面

**用途**：动态网站的重定向目标页面

**特点**：
- 服务器端处理能力
- 显示请求信息
- 动态内容生成
- PHP 环境信息

**部署方法**：
- 上传到支持 PHP 的源服务器
- 确保 PHP 版本 7.4 或更高
- 配置 UTF-8 编码支持

### 404.html - 备用错误页面

**用途**：当 Lambda@Edge 未启用时显示的错误页面

**特点**：
- 友好的错误提示
- 自动倒计时跳转
- 中文错误信息
- 调试辅助信息

**部署方法**：
- 在 CloudFront 中配置为自定义错误响应
- 或在源服务器上配置为 404 错误页面

## 🧪 测试方法

### 功能测试

1. **测试不存在的路径**：
   ```
   https://your-domain.cloudfront.net/test123
   https://your-domain.cloudfront.net/missing.html
   https://your-domain.cloudfront.net/folder/not-found
   ```

2. **测试中文路径**：
   ```
   https://your-domain.cloudfront.net/测试路径
   https://your-domain.cloudfront.net/中文文件夹/页面
   ```

3. **验证重定向**：
   - 打开浏览器开发者工具（F12）
   - 查看 Network 选项卡
   - 访问不存在的页面
   - 应该看到 302 重定向响应

### 预期结果

✅ **成功标志**：
- 浏览器地址栏自动跳转到 /index.php 或 /index.html
- 不显示 404 错误信息
- 页面内容正常显示
- 中文字符显示正确

❌ **失败情况**：
- 显示 404 错误页面
- 重定向不生效
- 中文显示乱码

## 🔍 问题排查

### 常见问题

#### 1. 重定向不生效

**可能原因**：
- CloudFront 部署未完成（状态显示"部署中"）
- Lambda@Edge 函数未正确关联
- 使用了 $LATEST 版本而不是发布的版本
- IAM 角色信任关系未正确配置

**解决方法**：
- 等待 CloudFront 部署完成（可能需要 10-20 分钟）
- 检查 CloudFront 行为设置中的 Lambda 关联
- 确保发布了函数版本并使用该版本
- 验证 IAM 角色包含 edgelambda.amazonaws.com

#### 2. 中文显示乱码

**可能原因**：
- 文件编码不是 UTF-8
- 服务器未发送正确的 Content-Type 头部
- 浏览器编码设置错误

**解决方法**：
- 确保所有文件保存为 UTF-8 编码（不带 BOM）
- 检查服务器响应头：Content-Type: text/html; charset=utf-8
- 在 HTML 中添加：`<meta charset="UTF-8">`
- 在 PHP 中添加：`header('Content-Type: text/html; charset=utf-8');`

#### 3. Lambda@Edge 日志查找不到

**可能原因**：
- Lambda@Edge 日志存储在执行该函数的区域
- 日志组名称格式特殊

**解决方法**：
- 在用户访问的最近区域查找 CloudWatch 日志
- 日志组格式：`/aws/lambda/us-east-1.函数名`
- 可能需要在多个区域查看日志

#### 4. PHP 页面无法访问

**可能原因**：
- 源服务器不支持 PHP
- PHP 配置错误
- 文件权限问题

**解决方法**：
- 确认源服务器安装了 PHP
- 检查 PHP 版本（建议 7.4+）
- 设置正确的文件权限（644）
- 查看服务器错误日志

## 📊 性能和限制

### Lambda@Edge 限制

| 项目 | 限制值 |
|------|--------|
| 函数大小（压缩后） | 1 MB |
| 执行超时时间 | 30 秒（源响应） |
| 内存分配 | 128 MB - 10240 MB |
| 环境变量 | 不支持 |
| 层（Layers） | 不支持 |

### CloudFront 限制

| 项目 | 限制值 |
|------|--------|
| 每个分配的 Lambda 关联 | 25 个 |
| 部署时间 | 5-30 分钟 |
| 全球传播时间 | 可能需要 24 小时 |

### 最佳实践

1. **代码优化**：
   - 保持函数代码简洁
   - 避免复杂的逻辑处理
   - 使用异步操作

2. **错误处理**：
   - 添加适当的错误捕获
   - 记录必要的日志信息
   - 提供回退机制

3. **缓存策略**：
   - 配置合理的缓存 TTL
   - 考虑缓存键设置
   - 使用缓存失效机制

4. **监控告警**：
   - 设置 CloudWatch 告警
   - 监控错误率和延迟
   - 定期检查日志

## 🛠️ 高级配置

### 自定义重定向逻辑

可以根据不同的 URL 模式重定向到不同的页面：

```javascript
exports.handler = async (event) => {
    const response = event.Records[0].cf.response;
    const request = event.Records[0].cf.request;

    if (response.status === '404') {
        response.status = '302';
        response.statusDescription = 'Found';
        
        // 根据请求路径决定重定向目标
        let redirectTarget = '/index.php';
        
        if (request.uri.startsWith('/api/')) {
            redirectTarget = '/api/index.php';
        } else if (request.uri.startsWith('/admin/')) {
            redirectTarget = '/admin/login.php';
        }
        
        response.headers.location = [{
            key: 'Location',
            value: redirectTarget
        }];
    }

    return response;
};
```

### 添加查询参数

可以在重定向 URL 中添加原始路径信息：

```javascript
exports.handler = async (event) => {
    const response = event.Records[0].cf.response;
    const request = event.Records[0].cf.request;

    if (response.status === '404') {
        response.status = '302';
        response.statusDescription = 'Found';
        
        // 将原始路径作为查询参数传递
        const originalPath = encodeURIComponent(request.uri);
        const redirectTarget = `/index.php?notfound=${originalPath}`;
        
        response.headers.location = [{
            key: 'Location',
            value: redirectTarget
        }];
    }

    return response;
};
```

### 记录重定向日志

添加日志记录便于调试和分析：

```javascript
exports.handler = async (event) => {
    const response = event.Records[0].cf.response;
    const request = event.Records[0].cf.request;

    if (response.status === '404') {
        // 记录详细信息到 CloudWatch
        console.log('404 重定向:', {
            uri: request.uri,
            querystring: request.querystring,
            clientIp: request.clientIp,
            headers: request.headers,
            timestamp: new Date().toISOString()
        });

        response.status = '302';
        response.statusDescription = 'Found';
        
        response.headers.location = [{
            key: 'Location',
            value: '/index.php'
        }];
    }

    return response;
};
```

## 📈 监控和维护

### CloudWatch 指标

监控以下关键指标：

1. **调用次数**：Lambda 函数执行次数
2. **错误数**：函数执行失败的次数
3. **持续时间**：函数执行时间
4. **限流次数**：达到并发限制的次数

### 日志查询

使用 CloudWatch Logs Insights 查询日志：

```
# 查找所有 404 重定向
fields @timestamp, @message
| filter @message like /404 重定向/
| sort @timestamp desc

# 统计重定向的 URL
fields request.uri as uri
| filter response.status = "404"
| stats count() by uri
| sort count desc
```

### 定期维护

1. **每月检查**：
   - 查看错误日志
   - 分析重定向模式
   - 检查性能指标

2. **每季度更新**：
   - 更新 Lambda 运行时
   - 优化函数代码
   - 审查 IAM 权限

3. **年度审计**：
   - 评估整体架构
   - 考虑成本优化
   - 更新文档

## 💰 成本估算

### Lambda@Edge 定价

- **请求费用**：每百万次请求 $0.60（us-east-1）
- **持续时间费用**：根据内存和执行时间计算
- **数据传输**：通过 CloudFront 传输不额外收费

### 示例成本

假设每天 100,000 次 404 请求：
- 月请求数：3,000,000
- 请求费用：$1.80
- 执行费用：约 $0.20（假设每次 50ms）
- **总计**：约 $2.00/月

## 📚 参考资源

### AWS 官方文档

- [Lambda@Edge 开发指南](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html)（中文版）
- [CloudFront 配置文档](https://docs.aws.amazon.com/cloudfront/)（中文版）
- [Lambda@Edge 限制和要求](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html)

### 技术博客

- AWS 中国博客：云计算最佳实践
- AWS 开发者中心：Lambda@Edge 教程
- 社区论坛：CloudFront 使用经验分享

## 🤝 贡献指南

欢迎提交问题和改进建议！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### 代码规范

- 使用 UTF-8 编码
- 提供中文注释
- 遵循现有代码风格
- 添加必要的测试

## 📝 版本历史

### v2.0.0 (2025-12-18)
- ✨ 新增完整的中文语言支持
- ✨ 添加详细的中文代码注释
- ✨ 创建中文版 HTML/PHP 示例页面
- ✨ 添加中文 404 错误页面
- ✨ 完善中文文档和使用说明
- 🐛 修复 UTF-8 编码问题

### v1.0.0 (2025-05-08)
- 🎉 初始版本发布
- ✅ 实现基本的 404 重定向功能
- 📝 提供中文操作指南

## 📞 技术支持

### 问题反馈

如遇到问题，请：
1. 查看本文档的问题排查章节
2. 检查 CloudWatch 日志
3. 在 GitHub 提交 Issue

### 联系方式

- **作者**：liangyimingcom
- **GitHub**：[项目仓库](https://github.com/liangyimingcom/Implement-404-automatic-redirection-to-index.html-on-CDN)

## 📄 许可证

本项目采用开源许可证，详见 LICENSE 文件。

## 🙏 致谢

感谢以下资源和工具：
- AWS Lambda@Edge 团队
- CloudFront 文档团队
- 开源社区的支持

---

**注意事项**：
- 本文档使用 UTF-8 编码，确保在支持中文的编辑器中打开
- 所有代码示例都经过测试，可直接使用
- 如有疑问，请参考 AWS 官方中文文档

**最后更新**：2025年12月18日

---

希望这个解决方案对您有帮助！🎉
