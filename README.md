# Vuex Module Accessor - Using Typescript to make Vuex type-safe

Managing the state of a large application without using types is an insane technical decision! We became aware of that in out team when out projects was getting larger and larger. So we decided to develop a wrapper to make sate management possible in a type-safe manner wihout loosing the benefits of Vuex.

## License

MIT License

## Installation

npm:

```bash
npm i vuex-module-accessor
```

yarn:

```bash
yarn add vuex-module-accessor
```

## Creating a module

Define the state of your module in a POJO class:

```typescript
class TestState {
	testValue: string = 'Module Accessor';
	count: number = 0;
}
```

and then define other parts of module by derivating a class from `Module<State>`:

```typescript
import { Module } from 'vuex-module-accessor';
class TestModule extends Module<TestState> {
	constructor() {
		super(new TestState());
	}
}
```

#### Mutations

Every setter in the module class will be considered as a mutation. Also you can use mutation decorator to define non-setter mutations.
Note that these are mutations for real, and so they will not have access to getters and actions.

```typescript
import { Module, mutation } from 'vuex-module-accessor';
class TestModule extends Module<TestState> {
	constructor() {
		super(new TestState());
	}

	// Becomes a mutation, and so can alter the state
	set count(count: number) {
		this.state.count = count;
	}

	// Another way to define a mutation, when defining a setter does not make sense
	@mutation
	reset() {
		this.state.count = 0;
	}
}
```

#### Getters

All getters will be considered as module getters.

```typescript
import { Module, mutation } from 'vuex-module-accessor';
class TestModule extends Module<TestState> {
	constructor() {
		super(new TestState());
	}

	get count(): number {
		return this.state.count;
	}
}
```

#### Actions

Methods without any decoration will be considered as actions. So they can read the state, access getters and call mutations.

```typescript
import { Module } from 'vuex-module-accessor';
class TestModule extends Module<TestState> {
	constructor() {
		super(new TestState());
	}

	increase() {
		// Reading state and calling a mutation
		this.count = this.state.count + 1;
	}
	decrease() {
		this.count = this.state.count - 1;
	}
}
```

### `ModuleAccessor`

`ModuleAccessor` will handle the conversion of the `Module` class to a typical `Vuex Module`. It also will provide a reference to `ModuleWrapper`, that will handle calling vuex operations in a type-safe manner.
You will use it like this to define a module and have a reference to access it anywhere in your program.

```typescript
// Defines a module based on TestModule with namespace /testStore/
export default new ModuleAccessor(new TestModule(), 'testStore/');
```

### Registering the module

#### Nuxt.js

In a Nuxt.js project, you are already done, you just have to put the file that was described above inside `store` directory. Note that the path must be compatible with the namespace that you specify:

~/store/testStore.ts

```typescript
export default new ModuleAccessor(new TestModule(), 'testStore/');
```

#### Vue

In a Vue project, you need to import accessor and register it as module, where you initialize Vuex store.
~/store/index.ts

```typescript
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
```

## Accessing the module

You can use the exported `ModuleWrapper` in order to access the Vuex module with type-safety.\
This will make interacting with Vuex feel like working with an ordinary class, and handles all the work needed to call the Vuex apis behind the scene.

### ModuleAccessor.of()

accessor.of() :
`ModuleWrapper` has a method, called `of()` that takes the store instance and returns the `Module` that can be used to access all module's features:

```typescript
import test from '../store/testStore';
test.of(this.$store).state.testValue; // Returns the value of testValue in state
```

You can use a computed value to avoid repeating `test.of(...)`:

```typescript
import test, { TestModule } from '../store/testStore';
...
computed: {
    ...
		testStore(): TestModule {
			return test.of(this.$store);
		},
		testValue():string{
		    return this.testStore.state.testValue;
		}
	...
	}
...
```

### typedMapState and typedMapGetters

This tool will provide type-safe versions of normal `mapState` and `mapGetters` apis, that will become handy:

```typescript
import { typedMapState } from 'vuex-module-accessor';
import { TestModule } from '../store/testStore';
...
computed: {
    ...
		...typedMapState(test, {
			testValue: (state) => state.testValue,
		}),
		...typedMapGetters(test, {
			count: testModule => testModule.count,
		})
	...
	},
	mounted() {
		console.log(this.testValue); // Contain value of testValue state
		console.log(this.count); // Contain value of count getter
	}
...
```

## Examples

#### [vue example](https://github.com/badihi/vuex-module-accessor/tree/master/Examples/vue-example)

#### [nuxt example](https://github.com/badihi/vuex-module-accessor/tree/master/Examples/nuxt-example)

#### [nuxt provider example](https://github.com/badihi/vuex-module-accessor/tree/master/Examples/nuxt-provider)

## Acknowledgments

This project is made during development of [MrBilit](https://mrbilit.com/), the online travel agency.
![Mrbilit](https://mrbilit.com/icon.png)

## Contribution

We have no plan for accepting contribution outside of our team on the project right now, until it becomes ready to be publicly developed.
Anyway, we are ready to hear feedbacks from you to improve it!
