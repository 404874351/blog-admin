<template>
  <div>
    <div class="title">{{ this.$route.name }}</div>

    <el-row :gutter="20" class="margin-bottom-lg">
      <el-col :span="6">
        <el-card>
          <div class="flex align-center justify-between">
            <div class="card-icon">
              <i class="el-icon-s-promotion text-blue"></i>
            </div>
            <div class="card-desc">
              <div class="text-gray margin-bottom">文章访问量</div>
              <div class="text-xxl text-black">
                <ICountUp :endVal="viewCount"/>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="flex align-center justify-between">
            <div class="card-icon">
              <i class="el-icon-s-release text-red"></i>
            </div>
            <div class="card-desc">
              <div class="text-gray margin-bottom">文章数</div>
              <div class="text-xxl text-black">
                <ICountUp :endVal="articleCount"/>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="flex align-center justify-between">
            <div class="card-icon">
              <i class="el-icon-user-solid text-orange"></i>
            </div>
            <div class="card-desc">
              <div class="text-gray margin-bottom">用户数</div>
              <div class="text-xxl text-black">
                <ICountUp :endVal="userCount"/>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="flex align-center justify-between">
            <div class="card-icon">
              <i class="el-icon-s-comment text-cyan"></i>
            </div>
            <div class="card-desc">
              <div class="text-gray margin-bottom">留言数</div>
              <div class="text-xxl text-black">
                <ICountUp :endVal="messageCount"/>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="margin-bottom-lg">
      <el-col :span="16">
        <el-card>
          <div class="text-bold">文章浏览量Top10</div>
          <div style="height:350px; width: 100%;" v-loading="articleViewLoading">
            <v-chart autoresize :option="articleViewOption"></v-chart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="text-bold">用户分布情况</div>
          <div style="height:350px; width: 100%;" v-loading="userRoleLoading">
            <v-chart autoresize :option="userRoleOption"></v-chart>
          </div>
        </el-card>
      </el-col>
    </el-row>

    
    <!-- <pre style="padding-left: 1.8em;" class="language-javascript line-numbers match-braces">
      <code>
      tinymce.init({
        selector: '#tinydemo',
        plugins: "codesample",
        toolbar: "codesample",
      });
      </code>
    </pre> -->

  </div>
</template>

<script>
import { 
  adminDashboardIndex,
  adminDashboardView,
  adminDashboardRole,
  adminDashboardCategory,
  adminDashboardTag } from "@/api/dashboard.js";

import ICountUp from 'vue-countup-v2';

export default {
  name: 'Dashboard',
  components: {
    ICountUp
  },
  data () {
    return {
      viewCount: 0,
      articleCount: 0,
      userCount: 0,
      messageCount: 0,

      articleViewLoading: true,
      articleViewOption: {
        color: ['#409eff'],
        title: {},
        tooltip: {},
        grid: {
          left: "0%",
          right: "0%",
          bottom: "0%",
          top: "10%",
          containLabel: true
        },
        xAxis: {
          data: [],
        },
        yAxis: {},
        series: [
          {
            name: "浏览量",
            type: "bar",
            data: [],
          },
        ],
      },

      userRoleLoading: true,
      userRoleOption: {
        legend: {
          top: "bottom"
        },
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            name: "用户角色",
            type: "pie",
            radius: ['40%', '70%'],
            itemStyle: {
              borderColor: '#fff',
              borderRadius: 5,
              borderWidth: 2
            },
            data: []
          }
        ]
      }

    }
  },
  created() {
    this.getData()
  },
  mounted() {  
    // this.$prism.highlightAll()

  },
  methods: {
    getData() {
      adminDashboardIndex().then(res => {
        this.viewCount = res.data.view
        this.articleCount = res.data.article
        this.userCount = res.data.user
        this.messageCount = res.data.message
      }).catch(err => {
        console.log(err);
      })

      adminDashboardView().then(res => {
        this.articleViewLoading = false
        res.data.forEach(item => {
          this.articleViewOption.series[0].data.push(item.viewCount)
          this.articleViewOption.xAxis.data.push(item.title)
        });
      }).catch(err => {
        console.log(err);
      })

      adminDashboardRole().then(res => {
        this.userRoleLoading = false
        res.data.forEach(item => {
          this.userRoleOption.series[0].data.push({
            name: item.name,
            value: item.count,
          })
        });
      }).catch(err => {
        console.log(err);
      })
    }
    
  }
}
</script>

<style scoped>
.card-icon {
  font-size: 55px;
}

.card-desc {
  min-width: 80px;
  font-weight: bold;
}
</style>