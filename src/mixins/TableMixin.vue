<script>
// 基础表格结构
// 使用 mixins: [TableMixin]
// 外层组件需编写表结构，并提供getData方法  
export default {
  name: "TableMixin",

  data() {
    return {
      loading: false,

      sizeList: [10, 20, 50],
      size: 10,

      total: 0,
      current: 1,
      pages: 1,
      list: [],

      multipleSelection: []
    }
  },
  created() {

  },
  methods: {
    /**
     * 初始化页，清空数据，清空选择，返回第一页
     */
    initPage() {
      this.total = 0,
      this.current = 1,
      this.pages = 1,
      this.list = [],
      this.multipleSelection = []
    },
    /**
     * 赋值页
     */
    setPage({current, total, pages, records}) {
        this.total = total;
        this.current = current;
        this.pages = pages;
        this.list = records;
    },
    /**
     * 行选择
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      
    },
    /**
     * 页大小改变
     */
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.initPage()
      this.size = size
      this.getData()
    },
    /**
     * 页码改变
     */
    handleCurrentChange(current) {
      console.log(`当前页: ${current}`);
      this.current = current
      this.multipleSelection = []
      this.getData()
    },
  }
}
</script>

<style>

</style>