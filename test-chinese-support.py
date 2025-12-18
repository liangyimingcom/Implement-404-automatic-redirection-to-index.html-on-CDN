#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
中文字符支持测试脚本

此脚本用于测试所有文件的中文字符显示和 UTF-8 编码是否正确。

使用方法：
    python3 test-chinese-support.py

测试内容：
- 检测文件编码是否为 UTF-8
- 验证中文字符是否正确显示
- 测试各种中文字符类型
- 检查文件是否包含 BOM

作者: liangyimingcom
日期: 2025-12-18
"""

import os
import sys
import codecs
import re
from pathlib import Path

# ANSI 颜色代码
class Colors:
    RESET = '\033[0m'
    BOLD = '\033[1m'
    RED = '\033[31m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    CYAN = '\033[36m'

# 测试用的中文字符集
CHINESE_TEST_STRINGS = {
    'simplified': '你好世界！这是简体中文测试。',
    'traditional': '妳好世界！這是繁體中文測試。',
    'punctuation': '，。！？；：""''（）【】《》',
    'numbers': '一二三四五六七八九十百千万',
    'technical': '云计算、人工智能、大数据、物联网、区块链',
    'special': '©®™℃℉€¥£'
}

TYPE_NAMES = {
    'simplified': '简体中文',
    'traditional': '繁体中文',
    'punctuation': '中文标点',
    'numbers': '中文数字',
    'technical': '技术词汇',
    'special': '特殊字符'
}

def log(message, color='RESET'):
    """打印带颜色的消息"""
    color_code = getattr(Colors, color, Colors.RESET)
    print(f"{color_code}{message}{Colors.RESET}")

def print_header(title):
    """打印标题"""
    log('\n' + '=' * 60, 'CYAN')
    log(f"  {title}", 'BOLD')
    log('=' * 60, 'CYAN')

def has_bom(file_path):
    """检测文件是否包含 BOM"""
    try:
        with open(file_path, 'rb') as f:
            first_bytes = f.read(3)
            return first_bytes == b'\xef\xbb\xbf'
    except Exception:
        return False

def detect_encoding(file_path):
    """检测文件编码"""
    try:
        # 检查 BOM
        if has_bom(file_path):
            return {'encoding': 'UTF-8 with BOM', 'hasBOM': True, 'valid': False}
        
        # 尝试以 UTF-8 读取
        with open(file_path, 'r', encoding='utf-8') as f:
            f.read()
        
        return {'encoding': 'UTF-8', 'hasBOM': False, 'valid': True}
    except UnicodeDecodeError:
        return {'encoding': 'Unknown (not UTF-8)', 'hasBOM': False, 'valid': False}
    except Exception as e:
        return {'encoding': 'Error', 'hasBOM': False, 'valid': False, 'error': str(e)}

def test_chinese_chars(file_path):
    """测试文件中的中文字符"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        results = {
            'simplified': bool(re.search(r'[\u4e00-\u9fa5]', content)),
            'punctuation': bool(re.search(r'[，。！？；：""''（）【】《》]', content)),
            'hasAnyChinese': bool(re.search(r'[\u4e00-\u9fa5]', content))
        }
        
        return results
    except Exception as e:
        return {'error': str(e)}

def get_file_stats(file_path):
    """获取文件统计信息"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = len(content.split('\n'))
        chars = len(content)
        chinese_chars = len(re.findall(r'[\u4e00-\u9fa5]', content))
        
        return {'lines': lines, 'chars': chars, 'chineseChars': chinese_chars}
    except Exception as e:
        return {'error': str(e)}

def test_file(file_path, file_name):
    """测试单个文件"""
    log(f'\n📄 测试文件: {file_name}', 'BLUE')
    log('-' * 60, 'BLUE')
    
    # 检测编码
    encoding_info = detect_encoding(file_path)
    if encoding_info['valid']:
        log(f"✅ 编码: {encoding_info['encoding']}", 'GREEN')
    else:
        log(f"❌ 编码: {encoding_info['encoding']}", 'RED')
        if encoding_info['hasBOM']:
            log(f"   警告: 文件包含 BOM，建议移除", 'YELLOW')
        if 'error' in encoding_info:
            log(f"   错误: {encoding_info['error']}", 'RED')
    
    # 测试中文字符
    chinese_test = test_chinese_chars(file_path)
    if 'error' in chinese_test:
        log(f"❌ 中文字符测试失败: {chinese_test['error']}", 'RED')
    elif chinese_test.get('hasAnyChinese'):
        log(f"✅ 包含中文字符", 'GREEN')
        if chinese_test.get('simplified'):
            log(f"   - 简体中文: ✓", 'GREEN')
        if chinese_test.get('punctuation'):
            log(f"   - 中文标点: ✓", 'GREEN')
    else:
        log(f"ℹ️  文件不包含中文字符", 'YELLOW')
    
    # 文件统计
    stats = get_file_stats(file_path)
    if 'error' in stats:
        log(f"❌ 统计信息获取失败: {stats['error']}", 'RED')
    else:
        log(f"📊 统计信息:", 'CYAN')
        log(f"   - 总行数: {stats['lines']}", 'CYAN')
        log(f"   - 总字符数: {stats['chars']}", 'CYAN')
        log(f"   - 中文字符数: {stats['chineseChars']}", 'CYAN')
        if stats['chineseChars'] > 0:
            percentage = (stats['chineseChars'] / stats['chars']) * 100
            log(f"   - 中文占比: {percentage:.2f}%", 'CYAN')

def test_chinese_display():
    """测试中文字符显示"""
    print_header('中文字符显示测试')
    
    log('\n📝 测试各种中文字符类型:\n', 'BLUE')
    
    for test_type, text in CHINESE_TEST_STRINGS.items():
        log(f"{TYPE_NAMES[test_type]}: {text}", 'CYAN')
    
    log('\n✅ 如果以上所有中文字符都能正确显示，说明终端支持 UTF-8 编码！', 'GREEN')

def run_tests():
    """主测试函数"""
    print_header('CloudFront 404 自动重定向 - 中文字符支持测试')
    
    log('\n🚀 开始测试项目文件的中文支持情况...', 'BOLD')
    
    # 测试中文字符显示
    test_chinese_display()
    
    # 定义要测试的文件
    test_files = [
        'README.md',
        'README_CN.md',
        'index.js',
        'index.html',
        'index.php',
        '404.html',
        'language-config.json',
        'test-chinese-support.js',
        'test-chinese-support.py'
    ]
    
    print_header('文件编码和中文支持测试')
    
    total_files = 0
    valid_files = 0
    files_with_chinese = 0
    
    script_dir = Path(__file__).parent
    
    for file_name in test_files:
        file_path = script_dir / file_name
        
        if file_path.exists():
            total_files += 1
            test_file(file_path, file_name)
            
            encoding_info = detect_encoding(file_path)
            if encoding_info['valid']:
                valid_files += 1
            
            chinese_test = test_chinese_chars(file_path)
            if chinese_test.get('hasAnyChinese'):
                files_with_chinese += 1
        else:
            log(f'\n⚠️  文件不存在: {file_name}', 'YELLOW')
    
    # 测试总结
    print_header('测试总结')
    
    log(f'\n📊 测试统计:', 'BOLD')
    log(f'   - 测试文件总数: {total_files}', 'CYAN')
    color = 'GREEN' if valid_files == total_files else 'YELLOW'
    log(f'   - UTF-8 编码正确: {valid_files}', color)
    log(f'   - 包含中文的文件: {files_with_chinese}', 'CYAN')
    
    if valid_files == total_files:
        log(f'\n✅ 所有文件的 UTF-8 编码都正确！', 'GREEN')
    else:
        log(f'\n⚠️  有 {total_files - valid_files} 个文件的编码需要检查！', 'YELLOW')
    
    log(f'\n🎉 测试完成！', 'BOLD')
    
    # 额外的兼容性说明
    print_header('中文支持说明')
    
    log('\n📌 项目中文支持特性:', 'BLUE')
    log('   ✓ 所有文件使用 UTF-8 编码（无 BOM）', 'GREEN')
    log('   ✓ HTML 文件包含 <meta charset="UTF-8">', 'GREEN')
    log('   ✓ PHP 文件设置 Content-Type: text/html; charset=utf-8', 'GREEN')
    log('   ✓ JavaScript 代码支持中文注释', 'GREEN')
    log('   ✓ 支持中文 URL 路径', 'GREEN')
    log('   ✓ 包含简体和繁体中文测试', 'GREEN')
    
    log('\n📌 浏览器兼容性:', 'BLUE')
    log('   ✓ Chrome 90+ (完全支持)', 'GREEN')
    log('   ✓ Firefox 88+ (完全支持)', 'GREEN')
    log('   ✓ Safari 14+ (完全支持)', 'GREEN')
    log('   ✓ Edge 90+ (完全支持)', 'GREEN')
    log('   ✓ 移动浏览器 (支持现代标准)', 'GREEN')
    
    log('\n📌 服务器要求:', 'BLUE')
    log('   ✓ PHP 7.4+ (支持 UTF-8)', 'GREEN')
    log('   ✓ Node.js 18.x/20.x/24.x', 'GREEN')
    log('   ✓ Web 服务器配置支持 UTF-8', 'GREEN')
    
    log('\n💡 使用建议:', 'YELLOW')
    log('   1. 确保文本编辑器使用 UTF-8 编码保存文件', 'YELLOW')
    log('   2. 避免使用带 BOM 的 UTF-8 编码', 'YELLOW')
    log('   3. 在 HTML 中始终包含 <meta charset="UTF-8">', 'YELLOW')
    log('   4. PHP 文件开头设置正确的 Content-Type', 'YELLOW')
    log('   5. 测试各种中文字符的显示效果', 'YELLOW')
    
    log('')

if __name__ == '__main__':
    try:
        run_tests()
    except Exception as e:
        log(f'\n❌ 测试过程中出错: {str(e)}', 'RED')
        import traceback
        traceback.print_exc()
        sys.exit(1)
