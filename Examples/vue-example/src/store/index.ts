import Vue from 'vue';
import Vuex from 'vuex';
// modules
import testStore from './testStore';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules: { testStore: testStore.getModule() }
});
