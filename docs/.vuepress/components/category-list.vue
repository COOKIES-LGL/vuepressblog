<template>
  <div class="box">
    <div class="demo" @click="go">{{ testMsg }}</div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, onActivated } from 'vue';
export default {
  props: {
    showType: Boolean,
  },
  setup(props, context) {
    console.log(props.showType); //取出Props的值
    const state = reactive({
      testMsg: 'data参数',
    });
    onMounted(async () => {
      //mounted
      init();
      console.log(state.testMsg);
    });
    onActivated(async () => {
      //activated
    });
    const methods = {
      go() {
        this.$router.push({
          path: '/main',
          query: {
            course_id: 123,
          },
        });
      },
    };
    //渲染页面的接口
    const init = async () => {
      await getFissionCourseList({ t35: 'post' }).then((res) => {
        // console.log(res);
      });
      await getGetrequs({ t35: 'get' }).then((res) => {
        // console.log(res);
      });
    };
    return {
      ...toRefs(state),
      ...methods,
    };
  },
};
</script>

<style lang="scss" scoped>
.box {
  height: 50px;
  background: #ccc;
  width: 100%;
}
</style>
