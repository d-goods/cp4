var app = new Vue({
  el: '#admin',
  data: {
    name: '',
    nameEdit: '',
    number: '',
    numberEdit: '',
    date: '',
    dateEdit: '',
    orders: [],
    editing: false
  },
  created: function() {
    this.getOrders();
  },
  methods: {
    showEdit() {
      this.editing = !this.editing
    },
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
    async editOrder(order) {
      try {
        axios.put("/api/orders/" + order._id, {
          name: order.name,
          number: order.number,
          date: order.date
        });
        this.showEdit();
        this.getOrders();
      } catch (error) {
        console.log(error);
      }
    },
    async removeOrder(order) {
      try {
        axios.delete("/api/orders/" + order._id);
        this.getOrders();
      } catch (error) {
        console.log(error);
      }
    },
  }
});