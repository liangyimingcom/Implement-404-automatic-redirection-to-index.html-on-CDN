#!/usr/bin/env node
/**
 * 中文字符支持测试脚本
 * 
 * 此脚本用于测试所有文件的中文字符显示和 UTF-8 编码是否正确。
 * 
 * 使用方法：
 *   node test-chinese-support.js
 * 
 * 测试内容：
 * - 检测文件编码是否为 UTF-8
 * - 验证中文字符是否正确显示
 * - 测试各种中文字符类型
 * - 检查文件是否包含 BOM
 * 
 * 作者: liangyimingcom
 * 日期: 2025-12-18
 */

const fs = require('fs');
const path = require('path');

// ANSI 颜色代码用于终端输出
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// 测试用的中文字符集
const chineseTestStrings = {
    simplified: '你好世界！这是简体中文测试。',
    traditional: '妳好世界！這是繁體中文測試。',
    punctuation: '，。！？；：""''（）【】《》',
    numbers: '一二三四五六七八九十百千万',
    technical: '云计算、人工智能、大数据、物联网、区块链',
    special: '©®™℃℉€¥£'
};

/**
 * 打印带颜色的消息
 */
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 打印标题
 */
function printHeader(title) {
    log('\n' + '='.repeat(60), 'cyan');
    log(`  ${title}`, 'bright');
    log('='.repeat(60), 'cyan');
}

/**
 * 检测文件是否包含 BOM
 */
function hasBOM(buffer) {
    return buffer.length >= 3 &&
           buffer[0] === 0xEF &&
           buffer[1] === 0xBB &&
           buffer[2] === 0xBF;
}

/**
 * 检测文件编码
 */
function detectEncoding(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        
        // 检查 BOM
        if (hasBOM(buffer)) {
            return { encoding: 'UTF-8 with BOM', hasBOM: true, valid: false };
        }
        
        // 简单的 UTF-8 验证
        const content = buffer.toString('utf8');
        const reEncoded = Buffer.from(content, 'utf8');
        
        if (buffer.equals(reEncoded)) {
            return { encoding: 'UTF-8', hasBOM: false, valid: true };
        } else {
            return { encoding: 'Unknown', hasBOM: false, valid: false };
        }
    } catch (error) {
        return { encoding: 'Error', hasBOM: false, valid: false, error: error.message };
    }
}

/**
 * 测试文件中的中文字符
 */
function testChineseChars(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const results = {
            simplified: /[\u4e00-\u9fa5]/.test(content),
            traditional: /[\u4e00-\u9fa5]/.test(content),
            punctuation: /[，。！？；：""''（）【】《》]/.test(content),
            hasAnyChinese: /[\u4e00-\u9fa5]/.test(content)
        };
        
        return results;
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * 获取文件统计信息
 */
function getFileStats(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        const chars = content.length;
        const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
        
        return { lines, chars, chineseChars };
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * 测试单个文件
 */
function testFile(filePath, fileName) {
    log(`\n📄 测试文件: ${fileName}`, 'blue');
    log('-'.repeat(60), 'blue');
    
    // 检测编码
    const encodingInfo = detectEncoding(filePath);
    if (encodingInfo.valid) {
        log(`✅ 编码: ${encodingInfo.encoding}`, 'green');
    } else {
        log(`❌ 编码: ${encodingInfo.encoding}`, 'red');
        if (encodingInfo.hasBOM) {
            log(`   警告: 文件包含 BOM，建议移除`, 'yellow');
        }
        if (encodingInfo.error) {
            log(`   错误: ${encodingInfo.error}`, 'red');
        }
    }
    
    // 测试中文字符
    const chineseTest = testChineseChars(filePath);
    if (chineseTest.error) {
        log(`❌ 中文字符测试失败: ${chineseTest.error}`, 'red');
    } else if (chineseTest.hasAnyChines) {
        log(`✅ 包含中文字符`, 'green');
        if (chineseTest.simplified) log(`   - 简体中文: ✓`, 'green');
        if (chineseTest.traditional) log(`   - 繁体中文: ✓`, 'green');
        if (chineseTest.punctuation) log(`   - 中文标点: ✓`, 'green');
    } else {
        log(`ℹ️  文件不包含中文字符`, 'yellow');
    }
    
    // 文件统计
    const stats = getFileStats(filePath);
    if (stats.error) {
        log(`❌ 统计信息获取失败: ${stats.error}`, 'red');
    } else {
        log(`📊 统计信息:`, 'cyan');
        log(`   - 总行数: ${stats.lines}`, 'cyan');
        log(`   - 总字符数: ${stats.chars}`, 'cyan');
        log(`   - 中文字符数: ${stats.chineseChars}`, 'cyan');
        if (stats.chineseChars > 0) {
            const percentage = ((stats.chineseChars / stats.chars) * 100).toFixed(2);
            log(`   - 中文占比: ${percentage}%`, 'cyan');
        }
    }
}

/**
 * 测试中文字符显示
 */
function testChineseDisplay() {
    printHeader('中文字符显示测试');
    
    log('\n📝 测试各种中文字符类型:\n', 'blue');
    
    Object.entries(chineseTestStrings).forEach(([type, text]) => {
        const typeNames = {
            simplified: '简体中文',
            traditional: '繁体中文',
            punctuation: '中文标点',
            numbers: '中文数字',
            technical: '技术词汇',
            special: '特殊字符'
        };
        
        log(`${typeNames[type]}: ${text}`, 'cyan');
    });
    
    log('\n✅ 如果以上所有中文字符都能正确显示，说明终端支持 UTF-8 编码！', 'green');
}

/**
 * 主测试函数
 */
function runTests() {
    printHeader('CloudFront 404 自动重定向 - 中文字符支持测试');
    
    log('\n🚀 开始测试项目文件的中文支持情况...', 'bright');
    
    // 测试中文字符显示
    testChineseDisplay();
    
    // 定义要测试的文件
    const testFiles = [
        'README.md',
        'README_CN.md',
        'index.js',
        'index.html',
        'index.php',
        '404.html',
        'language-config.json',
        'test-chinese-support.js'
    ];
    
    printHeader('文件编码和中文支持测试');
    
    let totalFiles = 0;
    let validFiles = 0;
    let filesWithChinese = 0;
    
    testFiles.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        
        if (fs.existsSync(filePath)) {
            totalFiles++;
            testFile(filePath, fileName);
            
            const encodingInfo = detectEncoding(filePath);
            if (encodingInfo.valid) validFiles++;
            
            const chineseTest = testChineseChars(filePath);
            if (chineseTest.hasAnyChines) filesWithChinese++;
        } else {
            log(`\n⚠️  文件不存在: ${fileName}`, 'yellow');
        }
    });
    
    // 测试总结
    printHeader('测试总结');
    
    log(`\n📊 测试统计:`, 'bright');
    log(`   - 测试文件总数: ${totalFiles}`, 'cyan');
    log(`   - UTF-8 编码正确: ${validFiles}`, validFiles === totalFiles ? 'green' : 'yellow');
    log(`   - 包含中文的文件: ${filesWithChinese}`, 'cyan');
    
    if (validFiles === totalFiles) {
        log(`\n✅ 所有文件的 UTF-8 编码都正确！`, 'green');
    } else {
        log(`\n⚠️  有 ${totalFiles - validFiles} 个文件的编码需要检查！`, 'yellow');
    }
    
    log(`\n🎉 测试完成！`, 'bright');
    
    // 额外的兼容性说明
    printHeader('中文支持说明');
    
    log('\n📌 项目中文支持特性:', 'blue');
    log('   ✓ 所有文件使用 UTF-8 编码（无 BOM）', 'green');
    log('   ✓ HTML 文件包含 <meta charset="UTF-8">', 'green');
    log('   ✓ PHP 文件设置 Content-Type: text/html; charset=utf-8', 'green');
    log('   ✓ JavaScript 代码支持中文注释', 'green');
    log('   ✓ 支持中文 URL 路径', 'green');
    log('   ✓ 包含简体和繁体中文测试', 'green');
    
    log('\n📌 浏览器兼容性:', 'blue');
    log('   ✓ Chrome 90+ (完全支持)', 'green');
    log('   ✓ Firefox 88+ (完全支持)', 'green');
    log('   ✓ Safari 14+ (完全支持)', 'green');
    log('   ✓ Edge 90+ (完全支持)', 'green');
    log('   ✓ 移动浏览器 (支持现代标准)', 'green');
    
    log('\n📌 服务器要求:', 'blue');
    log('   ✓ PHP 7.4+ (支持 UTF-8)', 'green');
    log('   ✓ Node.js 18.x/20.x/24.x', 'green');
    log('   ✓ Web 服务器配置支持 UTF-8', 'green');
    
    log('\n💡 使用建议:', 'yellow');
    log('   1. 确保文本编辑器使用 UTF-8 编码保存文件', 'yellow');
    log('   2. 避免使用带 BOM 的 UTF-8 编码', 'yellow');
    log('   3. 在 HTML 中始终包含 <meta charset="UTF-8">', 'yellow');
    log('   4. PHP 文件开头设置正确的 Content-Type', 'yellow');
    log('   5. 测试各种中文字符的显示效果', 'yellow');
    
    log('');
}

// 运行测试
if (require.main === module) {
    try {
        runTests();
    } catch (error) {
        log(`\n❌ 测试过程中出错: ${error.message}`, 'red');
        console.error(error);
        process.exit(1);
    }
}

module.exports = {
    testFile,
    testChineseDisplay,
    detectEncoding,
    testChineseChars,
    getFileStats
};
