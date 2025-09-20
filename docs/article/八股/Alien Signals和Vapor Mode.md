---
title: Alien Signals和Vapor Mode
tags:
  - 原理
  - 前端
  - vue
createTime: 2025/08/13 22:16:08
permalink: /article
---
默认的深度响应式机制在处理大规模数据结构或与虚拟 DOM (VDOM) 频繁交互时，对嵌套对象每个属性访问的拦截以及 VDOM diffing 过程的计算成本所需的性能开销较大。
从而催生了诸如 Alien Signals（专注于响应式引擎内部优化）和 Vapor Mode（专注于渲染机制优化）等实验性项目。
Alien Signals 代表了对 Vue 核心响应式引擎的一次重要内部重构，旨在借鉴现有经验、突破性能瓶颈，并为未来的架构演进（如 Vapor Mode）奠定基础。这种演变反映了一个更广泛的行业趋势：朝着更细粒度的响应式控制和更深度的编译器优化方向发展，以应对日益增长的应用复杂性和性能要求。

# Proxies和Effects

1. Proxy 拦截: 当使用 `reactive()` API 创建一个响应式对象时，Vue 内部会使用 `new Proxy()` 将原始对象包裹起来。这个 `Proxy` 对象定义了 `get` 和 `set` 陷阱（trap）。
2. `get` 陷阱：当读取响应式对象的属性时执行依赖收集（`track`）操作，记录下是哪个 `effect` 依赖了这个属性，然后返回属性的原始值。  
3. `set` 陷阱：当修改响应式对象的属性时会先更新属性的原始值，然后执行依赖触发（`trigger`）操作，通知所有依赖该属性的 `effect` 需要重新运行。
4. Effect (副作用): `effect` 本质上是一个函数包装器。任何需要根据响应式数据变化而自动重新执行的代码（例如组件的渲染函数、`watchEffect` 的回调）都会被包裹在一个 `effect` 中。Vue 内部维护一个全局的 `activeEffect` 栈。当一个 `effect` 函数执行时，它会被推入这个栈顶，标记为当前活动的 `effect`。执行完毕后，它会从栈中弹出。
5. Track (依赖收集): 当在 `get` 陷阱中读取属性时，如果 `activeEffect` 栈不为空（即当前有 `effect` 正在运行），`track` 函数就会被调用。`track` 的作用是在一个全局的数据结构（通常概念化为一个 `WeakMap<target, Map<key, Set<effect>>>` 的结构）中，建立起 "某个对象的某个属性" 与 "当前活动的 `effect`" 之间的依赖关系。这意味着，“这个 `effect` 依赖了那个属性”。
6. Trigger (依赖触发): 当在 `set` 陷阱中修改属性时，`trigger` 函数被调用。`trigger` 会根据被修改的属性，在全局依赖数据结构中查找所有依赖该属性的 `effect`，并将这些 `effect` 放入一个队列中，等待调度器在合适的时机（通常是微任务阶段）重新执行它们。

**缺点**
1. 响应式开销: `Proxy` 陷阱的调用和依赖追踪本身会产生一定的运行时开销。当一个操作（如组件渲染）需要访问大型对象或多个属性时（例如处理一个包含 10 万个属性的大型状态对象），这种累积的开销将变得非常显著，影响性能。
2. VDOM 交互成本: VDOM diffing 和 patching 本身需要计算资源和内存。对于大型列表或复杂的组件树，这个过程可能成为性能瓶颈。虽然 Vue 3 的编译器通过静态分析和优化（如 patch flags）来减少 VDOM 开销，但 VDOM 本身的机制仍存在固有的成本。Vapor Mode 的提出正是为了从根本上解决 VDOM 带来的这部分开销。
3. 默认深度响应式: 是 Vue 3 早期响应式系统的一个显著特点。它为开发者提供了便利，修改嵌套对象的属性也能自动触发更新，但对于包含大量属性、层级很深或者本身是不可变的数据结构（例如来自 API 的大型只读数据），深度响应式会带来不必要的性能开销。因为每一次对嵌套属性的访问都会触发 `Proxy` 的 `get` 陷阱，执行依赖追踪逻辑，即使这些属性很少变化或根本不被任何 `effect` 依赖。
4. 手动优化需求: 为了解决深度响应式的性能问题，Vue 3 提供了 `shallowRef()`, `shallowReactive()` 和 `markRaw()` 等 API。`shallowRef` 和 `shallowReactive` 只对对象的顶层属性进行响应式处理，内部嵌套的对象保持原样，访问它们不会触发依赖追踪。`markRaw` 则完全阻止一个对象被转换为代理。虽然这些 API 提供了优化手段，但它们要求开发者对响应式系统的内部机制有更深入的理解，并需要手动识别性能瓶颈并应用这些优化，增加了开发复杂性。
5. 边缘情况: 解构原始类型属性或替换整个响应式对象引用时丢失响应性的问题，虽然有文档说明，但仍是开发者容易遇到的坑。

Alien Signals 的核心目标是创建一个性能极致、开销更低的响应式系统。它旨在直接解决早期 `Proxy` 系统中观察到的性能瓶颈，例如深度追踪的开销和与 VDOM 更新相关的间接成本。
这种底层的响应式优化被视为实现更宏大架构目标（如 Vapor Mode）的关键基石。Vapor Mode 旨在通过编译时优化彻底消除 VDOM，生成直接操作 DOM 的代码。这种模式高度依赖一个极其高效和细粒度的响应式系统来精确地触发最小化的 DOM 更新。Alien Signals 正是为了满足这种需求而设计的底层引擎。

# Alien Signals

**特点**
1. 信号 (Signals) 作为原语: 与 SolidJS、Preact Signals 和 Angular Signals 类似，Alien Signals 也将“信号”作为其核心的响应式原语。包括：
- `signal`: 创建一个可变的信号源，持有基本状态值。
- `computed`: 创建一个计算信号，其值根据其他信号衍生而来，并且是惰性计算和缓存的。
- `effect`: 创建一个副作用，当其依赖的信号发生变化时自动重新执行。
2. 推拉结合 (Push-Pull) 机制: 这是 Alien Signals 算法的一个关键特征。当一个信号源的值发生变化时（“推”阶段），它会通知其直接或间接的依赖者（计算信号和副作用），将它们标记为“脏”（dirty）或可能需要更新。然而，实际的重新计算（对于 `computed`）或重新执行（对于 `effect`）通常会被推迟到它们的值被实际访问时（“拉”阶段），或者由调度器在稍后的某个时间点统一处理。这种惰性求值的策略可以避免不必要的计算，特别是当一个信号变化导致多个依赖项变脏，但只有部分依赖项的值最终被使用时。
3. 细粒度追踪 (Fine-Grained Tracking): 设计目标是实现非常精细的依赖追踪，直接将信号源与其精确的消费者（计算信号或副作用）联系起来。这使得更新能够更精确地定位到真正需要变化的部分，为 Vapor Mode 等编译器优化提供基础。
4. 性能约束: 为了达到极致性能，Alien Signals 在实现上施加了一些刻意的约束：
	- 避免内建集合: 在核心的传播逻辑中，不使用 JavaScript 内建的 `Array`, `Set`, `Map` 数据结构。这可能是因为这些通用集合在特定场景下（如频繁增删、大量小对象）可能引入额外的内存或性能开销（如哈希冲突、垃圾回收压力）。
	- 禁止递归: 在核心的依赖传播函数（如 `propagate`）中，避免使用函数递归调用。递归虽然在表达树状或图状遍历时很自然，但在深度依赖链中可能导致调用栈过深，甚至栈溢出，且函数调用本身也有开销。
5. 追求算法简洁性: 开发者发现，在上述约束下，保持核心算法的简洁性比实现复杂的调度策略能带来更显著的性能提升。这表明优化的重点在于基础操作的效率。
	- 链表 (Linked Lists): 为了高效管理依赖关系和订阅，Alien Signals 使用了链表结构（类似于 Preact Signals 的双向链表）。相比于标准的 `Map` 或 `Set`，链表在节点的插入和删除操作上可以达到 O(1) 的时间复杂度（如果持有节点的引用），并且在遍历时可能具有更好的缓存局部性。这种数据结构特别适合构建和维护信号之间的依赖图。
	- `**propagate**` 与 `checkDirty` 函数: 这两个函数（或类似逻辑）是推拉机制的核心。
	- `propagate`: 当一个信号源变化时，此函数负责沿着依赖图（通过链表）进行遍历。它不会立即执行更新，而是将下游的计算信号或副作用标记为需要重新检查或更新（例如，设置一个 `Dirty` 状态标志）。
	- `checkDirty`: 在“拉”阶段（例如，当访问一个 `computed` 信号的值时）或由调度器触发时，`checkDirty` 会检查目标的“脏”状态。如果标记为脏，它会触发必要的重新计算或副作用执行。
6. 避免递归的实现: 为了在 `propagate` 和 `checkDirty` 中消除递归，Alien Signals 采用了一种迭代式的实现方式。根据文档描述，它通过记录上一次循环的最后一个链表节点，并实现回滚逻辑来返回到该节点，从而在循环中处理依赖传播。虽然这种实现方式可能更难理解，但它避免了递归带来的性能开销和潜在的栈限制。  
7. 状态标志 (State Flags): 为了高效地管理每个订阅者（信号或副作用）的状态（例如，是否脏、是否正在追踪、是否已通知等），Alien Signals 使用了位运算标志 (`SubscriberFlags`)。通过位掩码操作，可以在一个整数上存储和查询多个布尔状态，这比使用多个布尔属性或对象更节省内存和计算资源。

## 响应式系统核心 (Reactive System Core)

它通过一个名为 `createReactiveSystem` 的内部函数创建，并提供了一系列底层工具函数，供 `signal`, `computed`, `effect` 等我们熟悉的 API 在内部使用。

### 1. 建立连接 (`link`)
当你在一个计算属性 (Computed) 或 副作用 (Effect) 的函数内部读取一个信号 (Signal) 时，系统需要记录下这种依赖关系。核心系统提供的 `link` 函数就负责这个任务。它会在信号和它的读取者（订阅者，Subscriber）之间建立一个链接。

 执行时机：当 `computed` 的计算函数执行并读取 `signal()` 时，或者当 `effect` 的函数执行并读取 `signal()` 时。
所做的处理：`link` 函数会把当前的 `computed` 或 `effect` (称为订阅者 `sub`) 添加到被读取的 `signal` (称为依赖 `dep`) 的订阅者列表 (`subs`) 中。同时，也会把这个 `signal` 添加到 `computed` 或 `effect` 的依赖列表 (`deps`) 中。这是一个双向记录的过程。

### 2. 传播变化 (`propagate`)
当一个信号 (Signal) 的值被写入新值时，它需要通知所有依赖它的订阅者（比如计算属性 (Computed) 或 副作用 (Effect)）。
核心系统提供的 `propagate` 函数负责这个“广播”任务。它会遍历信号的所有订阅者，并通知它们

执行时机：当调用 `mySignal(newValue)` 并且 `newValue` 与旧值不同时。
所做的处理： `propagate` 会找到所有通过 `link` 建立关系的订阅者。对于每个订阅者，它会设置一个状态标记（比如 `Dirty` 表示需要重新计算，`PendingComputed` 或 `PendingEffect` 表示需要检查或执行）。

### 3. 调度执行 (`notifyEffect`, `updateComputed`, `processEffectNotifications`)

仅仅标记订阅者需要更新还不够，系统还需要决定何时以及如何真正执行更新。比如，计算属性应该在被读取时才重新计算（惰性），而副作用则应该在依赖变化后尽快执行（但可能需要批量处理）。

核心系统提供了一些函数来管理这个调度过程：

- `updateComputed`：当一个被标记为 `Dirty` 的计算属性 (Computed) 被读取时，这个函数（或者调用它的 `processComputedUpdate`）会被触发。它负责：
	1. 开始追踪新的依赖 (`startTracking`)。
	2. 执行用户提供的计算函数 (`getter`)。
	3. 在执行过程中，通过 `link` 建立新的依赖关系。
	4. 结束追踪 (`endTracking`)，清理旧的、不再需要的依赖。
	5. 缓存新的计算结果。
	6. 如果结果变化了，可能需要继续 `propagate` 给下游依赖者。

- `notifyEffect`：当一个副作用 被标记为需要执行时（例如，在 `propagate` 之后），这个函数（或者调用它的 `processEffectNotifications`）会被触发。它负责：
	1. 开始追踪依赖 (`startTracking`)。
    2. 重新执行用户提供的副作用函数 (`fn`)。
    3. 在执行过程中，通过 `link` 建立或确认依赖关系。
    4. 结束追踪 (`endTracking`)。

- `processEffectNotifications`：这个函数通常在一次或一批更新操作结束后被调用。它会检查所有被标记为需要执行的副作用，并调用 `notifyEffect` 来实际执行它们。这有助于批量处理，避免同一个副作用在短时间内被触发多次。

这些调度函数确保了更新以一种高效且可预测的方式进行。

## 依赖追踪与链接 (Tracking & Linking)

1. 追踪 (Tracking): 当一个订阅者开始执行它的计算或副作用函数时，系统会启动“监视模式”。
2. 发现 (Discovery): 在执行过程中，该订阅者会读取其他响应式源。系统会“看到”这些读取操作。
3. 链接 (Linking): 系统会在数据源和读取它们的订阅者之间建立一个明确的联系档案。

这个过程是全自动的，我们不需要手动声明这些依赖关系。系统在运行时动态地构建出这张关系网或依赖图。

工作主要依赖于三个核心操作，这些操作由响应式系统核心提供：

### 1. 开始追踪 (`startTracking`)

**触发时机**
当一个计算属性需要重新计算其值时（在 `updateComputed` 内部），或者一个副作用被触发执行其函数时（在 `effect` 创建时或 `notifyEffect` 内部）触发。

**所做的处理**
1. 设置一个全局变量 `activeSub`，让它指向当前正在执行的这个订阅者（Computed 或 Effect 对象）。
2. 准备清理该订阅者旧的依赖列表。因为这次重新执行可能会读取不同的依赖项，旧的依赖关系可能不再有效。
3. 设置一个 `Tracking` 标志到订阅者对象上，表示它正处于依赖收集状态。

### 2. 读取与链接 (`link`)

**触发时机**
当 `activeSub` 存在（即系统处于追踪模式下）时，并且代码执行了 `someSignal()` 或 `someComputed()` 这样的读取操作。
**所做的处理**
1. 读取操作（比如 `signalGetterSetter` 或 `computedGetter`）会检查全局的 `activeSub` 是否有值。
2. 如果有，就调用核心的 `link(dependency, subscriber)` 函数（`dependency` 是被读取的信号或计算属性对象，`subscriber` 就是 `activeSub`）。
3. `link` 函数负责建立**双向链接**：
    - 将 `subscriber` 添加到 `dependency` 的订阅者列表 (`subs`) 中。
    - 将 `dependency` 添加到 `subscriber` 的依赖列表 (`deps`) 中。
4. 这样，就建立起来了依赖图中的一条边依此再建立依赖图的其他边。

### 3. 结束追踪 (`endTracking`)

**执行时机**
在订阅者的函数执行完毕后（比如 `updateComputed` 或 `notifyEffect` 的 `finally` 块中）。

**所做的处理**
1. 清理旧依赖: 这是 `endTracking` 的一个重要工作。在 `startTracking` 时，系统准备清空旧依赖。在追踪过程中，每次 `link` 操作都会标记一个依赖是“新的”或“仍然有效”。`endTracking` 会检查哪些旧的依赖在这次执行中没有被再次 `link`，并将这些无效的链接从双方（依赖的 `subs` 和订阅者的 `deps`）中断开。这确保了依赖关系总是最新的。这个清理工作通常由内部的 `clearTracking` 函数完成。
2. 清除之前设置的 `Tracking` 标志。
3. 恢复全局的 `activeSub` 到它之前的值（可能为 `undefined` 或外层的另一个订阅者）。

## 依赖 (Dependency)

它是一个可以被其他单元（订阅者）追踪或“订阅”的对象。当这个依赖对象的状态发生变化时，它需要知道应该通知谁。

依赖的核心职责：维护订阅者列表

它通过内部维护一个列表（通常是一个链表结构，为了高效添加和删除）来实现这一点。这个列表存储了所有当前依赖于这个依赖对象的 订阅者。

### 依赖的维护过程
**被追踪时**
当一个 订阅者（ `effect` 或 `computed`）在执行并读取这个依赖的值时，依赖追踪与链接机制会启动。核心函数 `link` 会被调用，将这个正在读取的订阅者添加到当前依赖对象的订阅者列表中。
**值变化时**
当依赖对象的值发生变化时（比如 `signal` 被赋予了新值），它需要通知所有关心它变化的订阅者。这时，它会取出自己的订阅者列表，并调用 响应式系统核心提供的 `propagate` 函数。`propagate` 函数会遍历这个列表中的每一个订阅者，并通知它们依赖的数据变了，可能需要更新。

## 订阅者 (Subscriber)

它是响应式系统中的一个核心单元，负责追踪一个或多个依赖，并在这些依赖发生变化时做出反应。

订阅者的核心职责：追踪与响应

### 订阅的维护过程

**追踪依赖**
1. 当订阅者执行其内部逻辑（比如 `computed` 的 `getter` 函数或 `effect` 的 `fn` 函数）时，依赖追踪与链接机制会自动工作。
2. 所有在执行期间被读取的 依赖（如信号或其他计算属性）都会被记录在订阅者内部的依赖项列表。

**接收通知**
1. 当一个被追踪的 依赖发生变化时，它会通过 响应式系统核心的 `propagate` 函数来通知所有订阅了它的订阅者。
2. `propagate` 函数会找到对应的订阅者，并更新其内部的一个状态标记`flags`。并标记了这条通知的状态（例如，“需要注意”、“等待处理”）。常见的标记有 `Dirty`（表示计算属性需要重新计算）、`PendingComputed`（表示其依赖的计算属性可能需要更新）、`PendingEffect`（表示副作用需要被执行）。

**对通知做出反应**
订阅者根据它的类型和当前的 `flags` 状态做出不同的响应。
- 计算属性：当它被标记为 `Dirty` 时，它并不会立即重新计算。而是等到下一次有人读取它的值时，它才会检查自己的 `flags`，发现是 `Dirty`，然后才执行自己的 `getter` 函数进行重新计算，并缓存新结果。（惰性求值）
- 对于 副作用：当它被标记为需要执行时（比如被 `propagate` 标记为 `PendingEffect` 并加入通知队列），响应式系统核心 (Reactive System Core) 的调度器（`processEffectNotifications`）会在适当的时机（通常是当前更新批次结束后）调用 `notifyEffect`，从而重新执行该副作用的 `fn` 函数。

## 副作用作用域 (EffectScope)

在实际使用时一个组件的内部，可能创建了好几个副作用
当这个组件不再需要（比如用户导航到其他页面，组件被卸载）时，这些 `effect` 就不应该再继续运行了。否则，它们可能会访问已经不存在的数据，或者执行不必要的操作，导致错误或内存泄漏。

可以手动保存每个 `effect` 返回的 `stop` 函数，然后在组件卸载时逐一调用它们（有些像c语言中手动管理堆区变量）
但如果有很多 `effect`，手动管理它们会变得非常繁琐且容易出错。我们希望有一种更简单的方式来组织和管理这些相关的 `effect`，并在需要时一次性将它们全部停止。

副作用作用域 (EffectScope) 就是为了解决这个问题而设计的

`EffectScope` 提供了一种组织和管理多个 副作用 (Effect) 生命周期的方法。在一个作用域内创建的 `Effect` 会自动被收集起来。当作用域被停止时，所有内部收集到的 `Effect` 也会被自动停止。
这使得管理一组相关的响应式效果变得非常方便，特别是在处理组件生命周期等场景时。

### 使用

#### 1. 创建作用域并收集 Effect
`effectScope` 函数可以创建一个新的副作用作用域。
调用 `effectScope` 函数，并传入一个函数作为参数。在这个函数内部创建的所有副作用和计算属性都会被自动收集到这个作用域中。
```ts
// 创建一个 EffectScope
const scope = effectScope(() => {
  // 在 scope 函数内部创建的 effect 会被自动收集
  effect(() => {
	// effect1的逻辑
  });

  effect(() => {
	// effect2的逻辑
  });

  const compute1=computed(()=>{
	//计算属性的逻辑
  })
});
```
传递给 `effectScope` 的函数 `() => { ... }` 会立即执行。

`effectScope` 函数会返回 `stop` 函数（就像 `effect` 返回 `stop` 函数一样）可以通过它来控制作用域的生命周期。
调用这个 `stop` 函数会停止该作用域内收集的所有 `effect`。

> [!NOTE] Title
> `alien signals` 实现 `effectScope` 可能与 Vue 3 的 `effectScope` API 略有不同，它可能直接返回 `stop` 函数，或者需要一个显式的 API 来获取。根据 `alien signals` 的代码，它直接返回了 `stop` 函数）。

##### 嵌套作用域

`EffectScope` 可以嵌套。当一个父作用域被停止时，它内部的所有子作用域以及这些子作用域中的所有 `effect` 都会被递归地停止。

### 副作用作用域的内部机制

#### 创建和收集的过程 (effectScope)

当调用 `effectScope(fn)` 时：

1. 创建 Scope 对象: 系统内部会创建一个 `EffectScope` 对象。这个对象需要像 订阅者一样，能够追踪依赖（它所收集的 `effect` 或子 `scope`），所以它也实现了 `Subscriber` 接口，拥有 `deps` 和 `flags` 等属性。它还有一个特殊的标记 `isScope: true` 来区分普通 `effect`。
2. 设置活动作用域 (`activeScope`): 系统会将一个全局变量 `activeScope` 设置为刚刚创建的这个 `EffectScope` 对象。
3. 执行用户函数 (`fn`): 系统立即执行传入的 `fn` 函数。
4. 自动链接: 在 `fn` 函数执行期间，如果内部调用了 `effect()` 来创建副作用：
5. `effect()` 函数内部会检查当前的 `activeScope` 是否存在。
    - 如果存在，`effect()` 会调用核心的 `link(effectObject, activeScope)` 函数。
    - 这会将新创建的 `effectObject` 添加到 `activeScope` 的依赖列表 (`deps`) 中，同时也会在 `effectObject` 内部（如果需要的话）记录它所属的 `scope`。
    - 如果内部又创建了嵌套的 `effectScope`，同样会进行链接。
6. 恢复活动作用域: 当 `fn` 函数执行完毕后（无论正常结束还是出错），系统会恢复 `activeScope` 到它之前的值（可能是 `undefined` 或外层的另一个 `scope`）。
7. 返回停止函数: `effectScope` 函数返回一个绑定了该 `EffectScope` 对象的 `stop` 函数（通常是 `effectStop`）。

#### 停止的过程 (stopScope)

当调用由 `effectScope` 返回的 `stopScope()` 函数时：

1. 目标 Scope 对象: `stopScope()` 函数内部的 `this` 指向对应的 `EffectScope` 对象。
2. 清理依赖: 这个 `stop` 函数（通常是 `effectStop`）的核心工作是清理该 `scope` 对象所追踪的所有依赖。它会利用 `startTracking(scope)` 和 `endTracking(scope)` 组合（这在 `alien signals` 中是一个通用的清理依赖的模式）。
3. `startTracking` 准备清理。
    - `endTracking` 遍历 `scope` 的 `deps` 列表（其中包含了所有直接收集的 `effect` 和子 `scope`）。对于每个依赖链接，它会调用 `clearTracking` 来断开链接。
    - 递归停止: 当 `clearTracking` 断开一个链接时，如果被断开的依赖本身也是一个 `EffectScope`（子作用域），它可能会触发子作用域的清理逻辑（虽然 `alien signals` 的 `clearTracking` 主要负责断链，但一个完整的实现会确保子作用域也被停止）。如果被断开的是一个 `effect`，则该 `effect` 将不再能被其依赖的信号通知，从而停止运行。

本质上，停止一个 `EffectScope` 就是遍历它收集的所有“文件”（`effect` 和子 `scope`），并确保它们与外界的联系（依赖关系）被切断，或者直接调用它们的 `stop` 方法。

## Alien Signals的使用

### 信号Signal

#### 创建信号
支持ts泛型指定存储信号的类型
```ts
const n1=signal('tom')
const n2=signal<string>('jerry')
```
返回值是一个**getter/setter函数**，这个函数使用bind绑定了创建的信号对象。内部的 `this` 指向的是创建的信号对象。（无参函数是getter函数，带参函数是setter函数）
```ts
console.log(n1()) //tom
n1('tuffy')
console.log(n1) //tuffy
```

当调用创建信号对象函数时内部会创建一个信号对象 。这个对象包含：
1. `currentValue`: 用来存储信号的当前值（也就是函数传入的值）。
2. `subs`: 记录所有订阅这个信号的订阅者链表。初始为空。
3. `subsTail`: 指向订阅者列表的末尾的指针，用于快速添加新的订阅者。

### 调用getter函数时的处理
函数检查当前是否在一个响应式上下文中。响应式上下文通常由计算属性(Computed)或副作用(Effect)创建。系统内部会有一个全局变量（如 `activeSub`）来标记当前活动的订阅者。
如果存在活动的订阅者 (`activeSub` 不为 `undefined`)：这意味着这次读取操作是某个“订阅者”为了计算自己的值或执行某些操作而进行的。这时，系统需要建立信号和这个订阅者之间的依赖关系。它会调用 `link(this, activeSub)` 函数（`this` 指向信号对象，`activeSub` 指向当前活动的订阅者），将这个订阅者添加到信号对象的 `subs` 列表中（如果尚未添加的话）。
无论是否存在活动的订阅者，函数最后都会返回信号对象中存储的 `this.currentValue`。

### 调用setter函数时的处理
首先比较传入的 `newValue` 和信号对象中存储的 `this.currentValue` 是否不同。
如果值发生了变化更新则将新值覆盖旧值。接着检查信号对象的 `subs` 列表是否为空。如果不为空，说明有订阅者关注了这个信号。它会调用 `propagate(this.subs)` 函数。`propagate` 函数会遍历 `subs` 列表中的所有订阅者，并通知它们。
如果值没有变化，则什么也不做。

## 计算属性Computed

Alien Signal中的计算属性的使用和之前的计算属性使用方式一样

### 创建计算属性时的处理
内部会创建一个计算属性对象，其中存储：
1. `getter`: 传入的计算函数。
2. `currentValue`: 用来缓存上一次计算的结果，初始可以是 `undefined`。
3. `flags`: 一些状态标记，比如标记自己是不是计算属性 (`SubscriberFlags.Computed`)，以及是否“脏” (`SubscriberFlags.Dirty`)。初始时通常标记为“脏”，因为还没有计算过。
4. `deps`: 依赖链表，用来记录这个计算属性依赖于哪些信号或计算属性。初始为空。
5. `subs`: 订阅链表，用来记录哪些其他计算属性或副作用依赖于这个计算属性。初始为空。

计算属性会返回一个使用bind函数绑定创建的计算属性对象的getter 函数。

### 读取计算属性时的处理

1. 检查状态: 检查计算属性对象的 `flags` 是否包含 `Dirty`（脏）或 `PendingComputed`（依赖的计算属性可能脏了，需要检查）标记。
2. 如果“脏”或“待检查”:
	- 调用响应式系统核心的 `processComputedUpdate(this, flags)` 函数来处理更新（`this` 指向计算属性对象）。
    - 在 `processComputedUpdate` 内部（或者它调用的 `updateComputed`）：调用 `startTracking(this)`。这会设置全局变量 `activeSub = this`，接下来读取的任何信号，都要把 `this` (当前计算属性) 记录为它们的订阅者。同时，它会准备清空旧的依赖列表 (`deps`)。
    - 执行 Getter: 调用用户提供的 `this.getter()` 函数。
    - 依赖收集: 在 `getter` 函数执行期间，如果它读取了某个信号，信号的读取逻辑会检测到 `activeSub`（即当前计算属性），并调用 `link(signalObject, this)`，将当前计算属性添加到信号的订阅者列表 (`subs`) 中，同时也将信号添加到当前计算属性的依赖列表 (`deps`) 中。这样就建立了双向链接。
    - 结束追踪: 调用 `endTracking(this)`。清除不再被读取的旧依赖，并将全局 `activeSub` 恢复原状。
    - 缓存结果: 比较新计算出的值和 `this.currentValue`。如果不同，更新 `this.currentValue`，并标记更新成功。
    - 清除标记: 清除 `Dirty` 和 `PendingComputed` 标记。
    - 传播变化 (如果值改变了): 如果计算结果确实改变了，并且有其他订阅者 (`this.subs` 不为空) 依赖于这个计算属性，会调用 `propagate(this.subs)` 来通知下游的订阅者它们也需要更新（将它们标记为 `Dirty` 或 `PendingComputed`）。
3. 如果不“脏”: 直接跳过计算步骤。
4. 建立上游依赖: 检查当前是否还有更高层的 `activeSub`（比如这个计算属性是在另一个计算属性或副作用 (Effect) 中被读取的）。如果有，则调用 `link(this, activeSub)`，将这个计算属性本身也链接到那个更高层的订阅者上。
5. 返回结果: 返回缓存的 `this.currentValue`。

### 依赖项变化时的处理

当计算属性依赖的某个信号 (Signal) 的值发生变化时：

1. 信号的写入逻辑（getter）执行。
2. 变化的信号会检查自己的订阅者列表 (`subs`)。因为在计算属性第一次计算时，所依赖的数据通过 `link` 函数把计算属性加入了自己的 `subs` 列表。
3. 信号调用 `propagate(this.subs)` 来通知它的所有订阅者。
4. `propagate` 函数会遍历订阅者列表，找到订阅的计算属性对象。
5. 它会给计算属性对象添加 `Dirty` 标记 (`flags |= SubscriberFlags.Dirty`)。如果计算属性对象又被其他计算属性或副作用依赖，`propagate` 还会继续递归地通知下去（可能会标记为 `PendingComputed` 或 `PendingEffect`）。

这样，当依赖项变化时，计算属性就被标记为“脏”，但实际的重新计算被推迟到下一次读取时进行。

## 副作用Effect

1. `effect(fn)` 创建一个副作用。
2. 副作用函数 `fn` 会立即执行一次。
3. 在 `fn` 执行期间，所有被读取的信号 (Signal) 或 计算属性 (Computed) 都会被自动追踪为该 `effect` 的依赖项。
4. 当任何一个依赖项的值发生变化时，副作用函数 `fn` 会被自动重新执行。

### 停止副作用
`effect` 函数会返回一个停止函数。调用这个函数就可以停止对应的副作用。

### 副作用创建时的处理

1. 内部会创建一个副作用对象。这个对象类似于计算属性对象，也需要存储：
- `fn`: 传入的副作用函数。
- `flags`: 状态标记，比如标记自己是副作用 (`SubscriberFlags.Effect`)。
- `deps`: 依赖链表，用来记录这个副作用依赖于哪些信号或计算属性。初始为空。
- `subs`: 副作用通常不作为其他计算的依赖（它在依赖链的末端），所以这个可能为空或不被主要使用。
- (它也可能与 `EffectScope` 相关联)。

2. 立即执行与依赖追踪: 与 `computed` 不同，`effect` 不会等待被读取，而是立即开始第一次执行：
- 调用 `startTracking(this)`。设置全局变量 `activeSub = this`（`this` 指向新创建的副作用对象）。
-  调用用户提供的副作用函数。
- 依赖收集: 在 `fn` 函数执行期间，如果它读取了某个信号，信号的读取逻辑会检测到 `activeSub`（即当前副作用对象），并调用 `link(signalObject, this)`，建立信号与副作用之间的依赖关系（将副作用添加到信号的 `subs` 列表，将信号添加到副作用的 `deps` 列表）。
- 调用 `endTracking(this)`。清除 `activeSub`，完成依赖追踪。

3. 返回停止函数 (`effectStop`): 这个函数绑定了刚才创建的副作用对象，调用它时清理依赖关系。

### 依赖变化时的处理

1. 信号的写入逻辑 (getter) 执行。
2. 检查自己的订阅者列表 (`subs`)。因为在 `effect` 第一次执行时，`counter` 通过 `link` 函数把这个 `effect` 加入了自己的 `subs` 列表。
3. 信号会调用 `propagate(this.subs)` 来通知它的所有订阅者。
4. `propagate` 函数遍历订阅者列表，找到对应的 `effect` 对象。
5. 给 `effect` 对象添加一个标记（例如 `Notified` 或 `PendingEffect`），表明这个副作用需要被处理。
6. `propagate` 可能会将这个 `effect` 对象添加到一个待处理的通知缓冲区 (`notifyBuffer`) 中。
7. 如果当前不在批量更新模式 (`batchDepth === 0`)，信号的写入逻辑会调用 `processEffectNotifications()`。
8. `processEffectNotifications()` 会遍历通知缓冲区，找到被标记的 `effect`。
9. 对于每个需要执行的 `effect`，它会调用 `notifyEffect(e)`。
10. 在 `notifyEffect` 内部（或者它调用的函数）：
	- 再次设置 `activeSub = e` 并调用 `startTracking(e)`。
    - 重新执行 `e.fn()`。
    - 调用 `endTracking(e)` 并恢复 `activeSub`。

# Vapor
一种基于编译时（Compile-time）优化的全新架构范式。它意味着Vue正在将开销尽可能地转到编译时（vue是一个运行时编译框架）。
VaporMode是一种受Solid.js启发的、基于编译时优化的新性能模式。它彻底改变了Vue的工作方式，将优化的重心从运行时转移到了编译时。
## 虚拟dom的开销

1. 内存开销（Memory Overhead）
在浏览器的内存中，除了维护一个真实的DOM树之外，还需要额外维护一个完整的虚拟dom树。对于复杂的应用，这会带来双倍的内存占用。

2. 运行时开销（Runtime Overhead）
 vnode 创建成本：当组件状态更新时，即使只有一小部分数据变化，默认仍会重新生成该组件的 vnode子树。
Diff 过程成本：新旧 VNode 树的比对过程，即Diff 算法，本身是一个递归遍历的过程。组件越复杂， vnode 树越庞大，Diff 的计算开销就越大。这个过程无论最终有无差异，都必须执行（过度对比）。
3. 启动与JavaScript负载（Initial Load & JS Payload）
包含虚拟DOM、Diff 算法、Patch 逻辑在内的运行时代码，是构成Vue 框架体积的一部分。用户首次进入页面时，需要下载、解析并执行这部分JavaScript，这会影响页面的可交互时间，对于内容展示为主、交互较少的页面，这部分运行时代码就会比较冗余。

虚拟DOM的代价根源在于其运行时的特性——它必须在浏览器运行时，通过比对才能知道变化的地方。

如果我们在代码被执行前，在“编译时”就已经能精确地知道模板中哪些部分是永不改变的（静态），哪些部分是可能改变的（动态），以及动态部分与哪个数据源绑定，那么就可以省略掉这些完整的vnode和运行时diff的过程

## 过程
在Vapor Mode 下，vue文件的模板会在编译阶段更加深度地优化：
1. 静态分析：遍历模板，识别出所有的动态绑定，如：双大括号取值、单向绑定、v-if
2. 生成指令式代码：为每一个动态绑定生成直接操作dom的代码，并将其放在响应式副作用（effect）中

示例：
如：
```vue
<p>{{msg}}<p>
```
会编译成
```js
// 1. 创建并插入静态模板
const p_element=document.createElement('p')
const text_node=document.createTextNode('')
p_element.appendChild(text_node)
document.parent.appendChild(p_element) //插入到parent父节点

// 2. 将响应式数据源（msg）与dom操作直接绑定
const msg=ref('hello')
renderEffect(()=>{
	//当msg变化时只执行这里面的操作
	text_node.textContent=msg.value
})
```

## vapor的优点
1. 极致的性能：消除了VNode 创建和运行时 Diff 的开销，更新性能只与动态绑定的数量有关，与模板的整体大小无关。
2. 更低的内存占用：无需在内存中维护VNode树。
3. 更小的框架体积：由于大部分工作有由编译器完成，最终打包的运行时代码可以更加轻量

| 对比维度  | 传统虚拟DOM模                | Vapor Mode                    |
| ----- | ----------------------- | ----------------------------- |
| 核心思想  | 运行时比对 (Runtime Diffing) | 编译时分析 (Compile-time Analysis) |
| 性能模型  | 更新成本与组件大小相关             | 更新成本仅与动态绑定数量相关                |
| 内存占用  | 较高 （VNode 树+真实 DOM）     | 极低 （仅真实DOM）                   |
| 运行时大小 | 较大 （包含 Diff/Patch 逻辑）   | 极小 （仅包含基础调度器）                 |
| 适用场景  | 高度动态、结构复杂的ui            | 性能敏感板结构相对稳定的场景                |
