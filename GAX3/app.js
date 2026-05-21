const { createApp } = Vue;

createApp({
  data() {
    return {
      form: {
        fullName: '',
        dob: '',
        gender: '',
        totalVisitors: '',
        childrenVisitors: '',
        accommodation: '',
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      },
      errors: {},
      generalError: '',
      places: [],
      isLoadingPlaces: false,
      placesError: '',
      selectedPlaces: [],
      accommodationOptions: [
        'No accommodation needed',
        'Forest View Hotel',
        'Totoro Family Inn',
        'Witch Valley Guesthouse',
        'Luxury Ghibli Resort'
      ],
      showSummary: false
    }
  },
  mounted() {
    this.loadPlaces();
  },
  methods: {
    async loadPlaces() {
      this.isLoadingPlaces = true;
      this.placesError = '';
      try {
        const response = await fetch('ghibli_park.json');
        if (!response.ok) {
          throw new Error('网络响应异常');
        }
        const data = await response.json();
        this.places = data;
      } catch (error) {
        this.placesError = 'Failed to load places. Please try again later.';
        console.error('加载景点错误:', error);
      } finally {
        this.isLoadingPlaces = false;
      }
    },
    togglePlace(place) {
      const index = this.selectedPlaces.findIndex(p => p.id === place.id);
      if (index !== -1) {
        // 已存在 -> 移除
        this.selectedPlaces.splice(index, 1);
      } else {
        // 不存在 -> 添加
        this.selectedPlaces.push(place);
      }
    },
    clearErrors() {
      this.errors = {};
      this.generalError = '';
      this.showSummary = false;
    },
    validateForm() {
      let isValid = true;

      // 面板1：个人信息
      if (!this.form.fullName.trim()) {
        this.errors.fullName = 'Full name is required.';
        isValid = false;
      }
      if (!this.form.dob) {
        this.errors.dob = 'Date of birth is required.';
        isValid = false;
      }
      if (!this.form.gender) {
        this.errors.gender = 'Gender is required.';
        isValid = false;
      }

      // 面板2：景点选择
      if (this.selectedPlaces.length === 0) {
        this.errors.selectedPlaces = 'Please select at least one Ghibli Park place.';
        isValid = false;
      }

      // 面板3：游客信息
      if (!this.form.totalVisitors || this.form.totalVisitors < 1) {
        this.errors.totalVisitors = 'Total visitors must be at least 1.';
        isValid = false;
      }
      if (this.form.childrenVisitors === '' || this.form.childrenVisitors < 0) {
        this.errors.childrenVisitors = 'Number of children cannot be negative.';
        isValid = false;
      }
      if (parseInt(this.form.childrenVisitors) > parseInt(this.form.totalVisitors)) {
        this.errors.childrenVisitors = 'Children cannot exceed total visitors.';
        isValid = false;
      }

      // 面板4：住宿
      if (!this.form.accommodation) {
        this.errors.accommodation = 'Accommodation selection is required.';
        isValid = false;
      }

      // 面板5：支付信息
      if (!this.form.cardholderName.trim()) {
        this.errors.cardholderName = 'Name on card is required.';
        isValid = false;
      }
      if (!this.form.cardNumber.trim()) {
        this.errors.cardNumber = 'Card number is required.';
        isValid = false;
      }
      if (!this.form.expiryDate) {
        this.errors.expiryDate = 'Expiration date is required.';
        isValid = false;
      }
      if (!this.form.cvv.trim()) {
        this.errors.cvv = 'CVC is required.';
        isValid = false;
      }

      return isValid;
    },
    generateItinerary() {
      this.clearErrors();
      
      const isValid = this.validateForm();
      
      if (!isValid) {
        this.generalError = 'There are mandatory items pending to be filled. Please complete the required fields.'; 
      } else {
        this.showSummary = true;
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }
}).mount('#app');