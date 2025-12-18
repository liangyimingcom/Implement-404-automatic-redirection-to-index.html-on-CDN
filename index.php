<?php
/**
 * CloudFront 404 自动重定向目标页面
 * 
 * 此页面是 404 错误自动重定向的目标页面。
 * 当用户访问不存在的资源时，Lambda@Edge 会将他们重定向到这里。
 * 
 * 功能特点：
 * - 完全支持中文内容显示
 * - 使用 UTF-8 编码确保中文正确显示
 * - 提供友好的用户界面
 * - 记录重定向信息供后续分析
 * 
 * 作者: liangyimingcom
 */

// 设置内容类型为 UTF-8 编码的 HTML，确保中文正确显示
header('Content-Type: text/html; charset=utf-8');

// 获取请求信息
$current_url = $_SERVER['REQUEST_URI'] ?? '/';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '未知';
$remote_addr = $_SERVER['REMOTE_ADDR'] ?? '未知';
$request_time = date('Y-m-d H:i:s');

// 检查是否是从 404 重定向过来的
$is_redirected = isset($_SERVER['HTTP_REFERER']) || $current_url !== '/index.php';
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>CloudFront 404 自动重定向 - PHP 版本</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            padding: 40px;
            max-width: 900px;
            width: 100%;
        }

        h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 20px;
            text-align: center;
        }

        h2 {
            color: #764ba2;
            font-size: 1.8em;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }

        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }

        .success-box {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }

        .warning-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .stat-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }

        .stat-label {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 5px;
        }

        .stat-value {
            color: #667eea;
            font-size: 1.2em;
            font-weight: bold;
            word-break: break-all;
        }

        .php-badge {
            background: #8892BF;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            display: inline-block;
            margin: 10px 5px;
        }

        ul {
            margin-left: 30px;
            margin-bottom: 15px;
        }

        li {
            margin-bottom: 10px;
            font-size: 1.05em;
        }

        .emoji {
            font-size: 1.2em;
        }

        footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
        }

        a {
            color: #667eea;
            text-decoration: none;
        }

        a:hover {
            color: #764ba2;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 CloudFront 404 自动重定向 (PHP 版本)</h1>
        
        <?php if ($is_redirected): ?>
        <div class="success-box">
            <h3>✅ 重定向成功！</h3>
            <p>您刚才访问的页面不存在，但系统已自动将您重定向到这里。这就是 Lambda@Edge 404 自动重定向功能的效果！</p>
        </div>
        <?php else: ?>
        <div class="info-box">
            <h3>ℹ️ 欢迎访问</h3>
            <p>这是 CloudFront 404 自动重定向的演示页面（PHP 版本）。</p>
        </div>
        <?php endif; ?>

        <h2>当前请求信息</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">请求时间</div>
                <div class="stat-value"><?php echo htmlspecialchars($request_time); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">当前 URL</div>
                <div class="stat-value"><?php echo htmlspecialchars($current_url); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">客户端 IP</div>
                <div class="stat-value"><?php echo htmlspecialchars($remote_addr); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">PHP 版本</div>
                <div class="stat-value"><?php echo PHP_VERSION; ?></div>
            </div>
        </div>

        <h2>技术特点</h2>
        <ul>
            <li><span class="emoji">🚀</span> <strong>动态 PHP 页面</strong>：支持服务器端处理和动态内容生成</li>
            <li><span class="emoji">🌐</span> <strong>完整中文支持</strong>：使用 UTF-8 编码，确保中文完美显示</li>
            <li><span class="emoji">📊</span> <strong>请求信息追踪</strong>：可以记录和分析用户访问信息</li>
            <li><span class="emoji">🔧</span> <strong>灵活扩展</strong>：可以轻松添加数据库、会话管理等功能</li>
            <li><span class="emoji">⚡</span> <strong>高性能</strong>：配合 CloudFront CDN 实现全球快速访问</li>
        </ul>

        <div class="warning-box">
            <h3>🧪 测试重定向功能</h3>
            <p>您可以通过访问以下任意不存在的 URL 来测试 404 重定向功能：</p>
            <ul style="margin-left: 20px;">
                <li><code>/test123</code></li>
                <li><code>/missing.html</code></li>
                <li><code>/folder/not-here.jpg</code></li>
                <li><code>/任意中文路径</code></li>
            </ul>
            <p>所有这些路径都会自动重定向回本页面！</p>
        </div>

        <h2>PHP 服务器信息</h2>
        <div class="info-box">
            <div class="php-badge">PHP <?php echo PHP_VERSION; ?></div>
            <div class="php-badge">UTF-8 编码</div>
            <div class="php-badge">中文支持 ✓</div>
            <p style="margin-top: 15px;">
                <strong>服务器软件：</strong> <?php echo htmlspecialchars($_SERVER['SERVER_SOFTWARE'] ?? '未知'); ?><br>
                <strong>请求方法：</strong> <?php echo htmlspecialchars($_SERVER['REQUEST_METHOD'] ?? 'GET'); ?><br>
                <strong>协议版本：</strong> <?php echo htmlspecialchars($_SERVER['SERVER_PROTOCOL'] ?? 'HTTP/1.1'); ?>
            </p>
        </div>

        <h2>Lambda@Edge 函数说明</h2>
        <div class="info-box">
            <p>当用户访问不存在的资源时，工作流程如下：</p>
            <ol>
                <li><strong>用户请求</strong>：浏览器发送请求到 CloudFront</li>
                <li><strong>源服务器响应</strong>：返回 404 状态码</li>
                <li><strong>Lambda@Edge 拦截</strong>：函数在源响应阶段被触发</li>
                <li><strong>状态码转换</strong>：将 404 改为 302 重定向</li>
                <li><strong>设置重定向</strong>：Location 头部指向 /index.php</li>
                <li><strong>浏览器跳转</strong>：自动导航到本页面</li>
            </ol>
        </div>

        <h2>中文字符测试</h2>
        <div class="success-box">
            <p><strong>以下是各种中文字符的显示测试：</strong></p>
            <p>
                简体中文：你好世界！这是一个测试页面。<br>
                繁体中文：妳好世界！這是一個測試頁面。<br>
                中文标点：，。！？；：""''（）【】《》<br>
                中文数字：一二三四五六七八九十百千万<br>
                技术词汇：云计算、人工智能、大数据、物联网<br>
                特殊字符：©®™℃℉€¥£
            </p>
            <p style="color: #28a745; font-weight: bold; margin-top: 10px;">
                ✅ 如果您能清晰看到以上所有中文字符，说明 UTF-8 编码工作正常！
            </p>
        </div>

        <h2>适用场景</h2>
        <ul>
            <li>单页应用（SPA）的前端路由需要服务器端支持</li>
            <li>需要动态处理 404 错误的 PHP 应用</li>
            <li>需要记录和分析 404 访问的网站</li>
            <li>使用 CloudFront + PHP 后端的 Web 应用</li>
            <li>需要根据用户信息提供个性化重定向的场景</li>
        </ul>

        <footer>
            <p><strong>作者：</strong>liangyimingcom</p>
            <p><strong>技术栈：</strong>AWS CloudFront + Lambda@Edge + PHP + Node.js 24.x</p>
            <p><strong>编码：</strong>UTF-8 (完全支持中文)</p>
            <p><strong>更新时间：</strong><?php echo $request_time; ?></p>
            <p>© 2025 | 更多信息请参阅 <a href="https://github.com/liangyimingcom/Implement-404-automatic-redirection-to-index.html-on-CDN" target="_blank">GitHub 仓库</a></p>
        </footer>
    </div>

    <script>
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ CloudFront 404 自动重定向演示页面已加载 (PHP 版本)');
            console.log('📍 当前页面完全支持中文显示');
            console.log('🐘 PHP 版本: <?php echo PHP_VERSION; ?>');
            console.log('🌐 当前 URL: <?php echo $current_url; ?>');
            console.log('⏰ 请求时间: <?php echo $request_time; ?>');
            
            <?php if ($is_redirected): ?>
            console.log('🔄 您是通过 404 重定向到达此页面的');
            <?php endif; ?>
        });
    </script>
</body>
</html>
