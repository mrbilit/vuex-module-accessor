<template>
	<foo-provider root>
		<template #default="{ provider }">
			<bar-provider>
				<div class="container">
					{{ `${provider.state.count}` }}
					<client-only>
						<counter />
					</client-only>
				</div>
			</bar-provider>
		</template>
	</foo-provider>
</template>

<script lang="ts">
import Vue from 'vue';

import FooModule from '../providers/fooModule';
import BarModule from '../providers/barModule';

import Counter from '../components/Counter.vue';

import { provider } from '../../../lib/context';

export default Vue.extend({
	computed: {},
	components: {
		FooProvider: provider(FooModule),
		BarProvider: provider(BarModule),
		Counter
	}
});
</script>

<style>
.container {
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
}

button {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.1);
	border: 0;
	outline: none;
	cursor: pointer;
	overflow: hidden;
	box-sizing: border-box;
	padding: 10px;
	margin: 10px;
}
button:hover {
	box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
}

title {
	font-size: 18px;
	margin-bottom: 20px;
}

.counter-container {
	display: flex;
	align-items: center;
}
</style>
