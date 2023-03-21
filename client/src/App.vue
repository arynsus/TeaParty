<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <a-layout>

        <!-- 顶部导航栏 -->
        <a-layout-header>
            <a-menu mode="horizontal">
                <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
                    <h3 class="brand">Tea Party</h3>
                </a-menu-item>
                <RouterLink to="/tea-finder"><a-menu-item key="1">Tea Finder</a-menu-item></RouterLink>
                <RouterLink to="/admin"><a-menu-item key="2">Admin</a-menu-item></RouterLink>
                <RouterLink to="/about"><a-menu-item key="3">About</a-menu-item></RouterLink>
            </a-menu>
        </a-layout-header>

        <!-- 主内容，以虚拟路由形式根据访问地址展示页面，地址配置在 /client/src/router/index.js -->
        <a-layout-content style="min-height: calc(100vh - 160px); margin: 20px 40px">
            <RouterView />
        </a-layout-content>

        <!-- 虚假的页脚 -->
        <a-layout-footer>
            <p class="footer-text">Some Random Nonsense as Footer</p>
        </a-layout-footer>
    </a-layout>
</template>

<style scoped>
.brand {
    color: #232323;
    font-weight: 700;
    font-size: 20px;
}

.footer-text {
    text-align: center;
    color: #4d4d4d;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 20px;
}
</style>
