/**
 * CloudFront 404 自动重定向 Lambda@Edge 函数
 * 
 * 功能说明：
 * 此函数用于拦截 CloudFront 分配中的 404 响应，并自动将其转换为 302 重定向到 /index.php 页面。
 * 这样可以确保用户在访问不存在的资源时，能够被引导到主页而不是看到错误信息。
 * 
 * 部署要求：
 * - 必须在美国东部(弗吉尼亚北部)区域 (us-east-1) 创建
 * - 需要关联到 CloudFront 分配的 "源响应" (Origin Response) 事件
 * - 运行时环境: Node.js 24.x (支持至 2028年4月)
 * 
 * 作者: liangyimingcom
 * 最后更新: 2025-05-08
 */

/**
 * Lambda@Edge 处理函数
 * 
 * @param {Object} event - CloudFront 触发事件对象
 * @param {Array} event.Records - 包含 CloudFront 请求/响应信息的记录数组
 * @returns {Object} 修改后的响应对象
 * 
 * 处理流程：
 * 1. 检测响应状态码是否为 404
 * 2. 如果是 404，则将状态码改为 302 (临时重定向)
 * 3. 设置 Location 头部指向 /index.php
 * 4. 返回修改后的响应，由 CloudFront 发送给客户端
 */
exports.handler = async (event) => {
    // 从事件对象中获取 CloudFront 响应
    const response = event.Records[0].cf.response;

    // 检查响应状态码是否为 404 (资源未找到)
    if (response.status === '404') {
        // 将 404 状态码改为 302 (临时重定向)
        response.status = '302';
        
        // 设置状态描述为 "Found" (HTTP 302 的标准描述)
        // 注意: HTTP 状态描述通常保持英文，这是 HTTP 协议标准
        response.statusDescription = 'Found';
        
        // 如果响应中已存在 location 头部，先删除它
        // 这样可以确保不会有重复的 Location 头部
        if (response.headers['location']) {
            delete response.headers.location;
        }
        
        // 设置新的 Location 头部，指向 /index.php
        // 用户的浏览器会自动跳转到这个地址
        response.headers.location = [{
            key: 'Location',
            value: '/index.php'
        }];
    }

    // 返回修改后的响应对象
    // 如果不是 404 响应，则原样返回，不做任何修改
    return response;
};
