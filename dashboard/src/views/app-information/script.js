import MixinInput from './input.vue'

export default {
  name: 'app-information',
  components: {
    MixinInput
  },
  props: ['active_app'],
  data() {
    return {
      icon_base64: '',
      can_save: false,
    }
  },
  computed: {
    app_name: {
      get() {
        return this.$store.state.app_name
      },
      set(val) {
        this.$store.commit('change_state', { app_name: val })
      }
    },
    resource_patterns: {
      get() {
        return this.$store.state.resource_patterns
      },
      set(val) {
        this.$store.commit('change_state', { resource_patterns: val })
      }
    },
    immersive_status: {
      get() {
        return this.$store.state.immersive_status
      },
      set(val) {
        this.$store.commit('change_state', { immersive_status: val })
      }
    }
  },
  watch: {
    active_app(val) {
      this.init_app(val)
    }
  },
  methods: {
    submit_to_database() {
      if (!this.can_save) return
      _submit_to_database.call(this)
    },
    getFile(event) {
      _render_file_to_base64.call(this, event.target.files[0])
    },
    check_is_finished() {
      _check_is_finished.call(this)
    },
    init_app(app) {
      this.icon_base64 = '';
      let { name, resource_patterns, capabilities } = app
      if (name) this.app_name = name
      if (resource_patterns) this.resource_patterns = resource_patterns && resource_patterns.join('\n')
      if (capabilities) this.immersive_status = capabilities && capabilities.includes('IMMERSIVE')
      _check_is_finished.call(this)
    }
  },
  mounted() {
    this.init_app(this.active_app)
  }
}

function _render_file_to_base64(file) {
  let reader = new FileReader();
  reader.addEventListener('load', event => this.icon_base64 = event.target.result, false)
  reader.readAsDataURL(file);
}

let once_submit = false

function _submit_to_database() {
  if (once_submit) {
    this.$message.error({ message: this.$t('message.errors.saving'), showClose: true });
    return
  }
  let { app_id, capabilities, description, home_uri, redirect_uri } = this.active_app
  let name = this.app_name
  if (capabilities) {
    let index = capabilities.findIndex(item => item === 'IMMERSIVE')
    if (this.immersive_status) {
      index === -1 && capabilities.push('IMMERSIVE')
    } else {
      index !== -1 && capabilities.splice(index, 1)
    }
  } else {
    capabilities = ["CONTACT", "GROUP"]
    this.immersive_status && capabilities.push('IMMERSIVE')
  }
  let parmas = { capabilities, description, home_uri, name, redirect_uri }
  parmas.icon_base64 = this.icon_base64.substring(this.icon_base64.split('').findIndex(item => item === ',') + 1);

  parmas.resource_patterns = this.resource_patterns && this.resource_patterns.split('\n') || []
  once_submit = true;
  this.$emit('loading', true)
  this.apis.set_app(app_id, parmas).then(res => {
    if (res && res.type === 'app') {
      this.$message.success({ message: this.$t('message.success.save'), showClose: true })
      this.$emit('add_new_app', res.app_id)
      this.$store.dispatch('init_app', true)
    }
  }).finally(_ => {
    once_submit = false
    this.$emit('loading', false)
  })
}


function _check_is_finished() {

  if (this.app_name && this.active_app.home_uri && this.active_app.redirect_uri && this.active_app.description) {
    this.can_save = true;
  } else {
    this.can_save = false;
  }
}