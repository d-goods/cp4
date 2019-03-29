var app = new Vue({
  el: '#app',
  data: {
    name: '',
    span: true,
    clockin: '',
    clockout: '',
    time: 0.0,
    crew: 'Video',
    crews: [
      'Video',
      'Audio',
      'Lighting',
      'Delivery'
    ],
    order: null,
    orders: []
  },
  created: function() {
    this.getOrders();
  },
  computed: {
    computedTime: function() {
      if(this.clockin !== '' && this.clockout !== '') {
        let hours, minutes, total = 0;
        let in_strs = this.clockin.split(":");
        let out_strs = this.clockout.split(":");
        let in_ints = in_strs.map(x => parseInt(x));
        let out_ints = out_strs.map(y => parseInt(y));
        let in_hour = in_ints[0];
        let out_hour = out_ints[0];
        let in_mins = in_ints[1];
        let out_mins = out_ints[1];
        if(out_hour < in_hour) {
          hours = (24 - in_hour) + out_hour;
        } else {
          hours = out_hour - in_hour;
        }
        hours -= 1;
        minutes = (60 - in_mins) + out_mins;
        total = hours + (minutes / 60);
        return total.toFixed(2);
      }
    }
  },
  methods: {
    select_num(order) {
      this.order = order;
    },
    async getOrders() {
      try {
        const response = await axios.get("/api/orders");
        this.orders = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async sendEmail() {
      if(this.name === '' || this.clockin === '' || this.clockout === '' || this.order === null) {
        alert("Please fill all fields!");
      } else {
        try {
          var body = 'Name: ' + this.name + '<br>' +
            'Work Order: <b>' + this.order.number + '</b><br>' +
            'Crew: ' + this.crew + '<br>' +
            'Time Worked: ' + this.computedTime;
          await axios.post('/api/send-email', {
            subject: "Time for " + this.order.name,
            message: body
          });
          alert("Email sent!");
          this.name = this.clockin = this.clockout = '';
          this.order = null;
        } catch (error) {
          console.log(error);
        }
      }
    },
  }
});
