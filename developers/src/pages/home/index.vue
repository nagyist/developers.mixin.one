<template>
  <div :class="['home-page', $i18n.locale]" ref="root">
    <Header />
    <img class="bg-top" src="@/assets/img/svg/home_bg_top.svg" />
    <img class="bg-bottom" src="@/assets/img/svg/home_bg_bottom.svg" />

    <!--  -->
    <section class="main-title">
      <h2>
        {{t('home.main.title')}}
        <i
          v-for="i in 3"
          :key="i"
          class="title-dec"
        ></i>
      </h2>
      <ul>
        <li
          v-for="(item, index) in tm('home.main.info')"
          :key="index"
          v-html="item"
        ></li>
        <div class="decoration-list">
          <img
            src="@/assets/img/coin/coder.png"
            class="decoration"
          />

          <i class="decoration left-line"></i>
          <i class="decoration right-line"></i>
        </div>
        <div class="router-list">
          <a
            v-for="(item, index) in tm('home.main.button')"
            :key="index"
            :href="mainRoute[index]"
            :target="'_blank'"
            class="button"
          >{{item}}</a>
        </div>
      </ul>
    </section>

    <!--  -->
    <section class="latest-news">
      <h2>{{t('news.title')}}</h2>
      <ul>
        <li
          v-for="(item,index) in tm('news.list').slice(0,6)"
          :key="index"
        >
          <a :href="'/news/'+item.filename" class="title">{{item.title}}</a>
          <span class="time">{{item.date}}</span>
        </li>
      </ul>
      <router-link
        class="button"
        to="/news"
        tag="a"
      >{{t('home.button.readmore')}}</router-link>
    </section>

    <!--  -->
    <section class="user-cases">
      <h2>{{t('cases.title')}}</h2>
      <ul>
        <li v-for="(item,index) in tm('cases.list').slice(0,2)" :key="index">
          <div class="title">{{item.title}}</div>
          <div v-html="item.info" class="desc"></div>
        </li>
      </ul>
      <a class="button" href="cases">{{t('home.button.readmore')}}</a>
    </section>
    <Footer />
  </div>
</template>

<script>

import { onMounted, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '@/components/MainHeader.vue';
import Footer from '@/components/MainFooter.vue';
import { changeTheme } from '@/utils/tools';

export default {
  name: 'Home',
  components: { Header, Footer },
  setup() {
    const { t, tm } = useI18n();
    const state = reactive({
      mainRoute: ['/document', '/dashboard'],
    });

    onMounted(() => {
      changeTheme('#fff');
    });

    return {
      t,
      tm,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
@use "./style.scss";
</style>
