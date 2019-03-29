var app = new Vue({
  el: '#admin',
  data: {
    name: '',
    date: '',
    number: '',
    orders: []
  },
  created: function() {
    this.getOrders();
  },
  methods: {
    async getOrders() {
      try {
        const response = await axios.get("/api/orders");
        this.orders = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async submitOrder() {
      try {
        const response = await axios.post("/api/orders", {
          name: this.name,
          number: this.number,
          date: this.date
        });
        this.name = this.number = this.date = "";
        this.getOrders();
      } catch (error) {
        console.log(error);
      }
    },
    async removeOrder(order) {
      try {
        axios.delete("/api/orders/" + order.id);
        this.getOrders();
      } catch (error) {
        console.log(error);
      }
    },
  }
});