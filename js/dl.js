window.dataLayer = window.dataLayer || [];

function gtag() { dataLayer.push(arguments); }

const DL = {
  plans: {
    basico: { id: 'plan-basico', name: 'Plan Básico', price: 67, currency: 'EUR' },
    pro: { id: 'plan-pro', name: 'Plan Pro', price: 97, currency: 'EUR' },
    premium: { id: 'plan-premium', name: 'Plan Premium', price: 297, currency: 'EUR' }
  },

  currentPlan: null,
  selectedCourse: null,

  setCourse(course) {
    this.selectedCourse = course;
  },

  selectPlan(planKey) {
    this.currentPlan = this.plans[planKey];
    if (!this.currentPlan) return;
    this.pushAddToCart(this.currentPlan);
  },

  pushEvent(event, data) {
    dataLayer.push({ ecommerce: null });
    dataLayer.push({ event, ecommerce: data });
  },

  pushViewItem(item) {
    this.pushEvent('view_item', {
      currency: item.currency || 'EUR',
      value: item.price,
      items: [{
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'Curso',
        price: item.price,
        quantity: 1
      }]
    });
  },

  pushAddToCart(plan) {
    this.pushEvent('add_to_cart', {
      currency: plan.currency,
      value: plan.price,
      items: [{
        item_id: plan.id,
        item_name: plan.name,
        item_category: 'Plan',
        price: plan.price,
        quantity: 1
      }]
    });
  },

  pushBeginCheckout(plan) {
    this.pushEvent('begin_checkout', {
      currency: plan.currency,
      value: plan.price,
      items: [{
        item_id: plan.id,
        item_name: plan.name,
        item_category: 'Plan',
        price: plan.price,
        quantity: 1
      }]
    });
  },

  pushPurchase(plan) {
    this.pushEvent('purchase', {
      transaction_id: 'EB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      affiliation: 'excel_bite',
      value: plan.price,
      currency: plan.currency,
      tax: 0,
      shipping: 0,
      items: [{
        item_id: plan.id,
        item_name: plan.name,
        item_category: 'Plan',
        price: plan.price,
        quantity: 1
      }]
    });
  },

  pushLead(formType) {
    dataLayer.push({
      event: 'lead',
      form_type: formType || 'contacto'
    });
  },

  pushFormSubmit(formType) {
    dataLayer.push({
      event: 'form_submit',
      form_type: formType || 'contacto',
      form_location: window.location.pathname
    });
  },

  pushScrollDepth(depth) {
    dataLayer.push({
      event: 'scroll_depth',
      scroll_percentage: depth
    });
  },

  pushVideoProgress(action, title) {
    dataLayer.push({
      event: 'video_' + action,
      video_title: title || 'Video promocional',
      video_current_time: action === 'start' ? 0 : undefined
    });
  },

  pushClick(label, category) {
    dataLayer.push({
      event: 'click',
      click_label: label,
      click_category: category || 'interaction'
    });
  }
};
