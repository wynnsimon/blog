---
title: Vitest
createTime: 2025/06/21 18:16:58
permalink: /front/vitest/
---
测试文件使用`.test.js`结尾，测试框架会自动识别这样结尾的文件当做测试运行

**单元测试unit testing**
在软件中最小可测试单元进行检查和验证
简单来说就是模块，对导出的模块进行测试

每个测试文件默认都是使用describe包裹进行分组的，只不过每个文件最外层默认省略了
生命周期是针对于describe的，如果多层describe嵌套则会像栈一样先执行外层的before后执行内层的before，而对于after则是先执行内层的after，后执行外层的after


# 开启测试
普通文件中使用到的函数（被测试的函数）
```ts
export function add(a:number,b:number):number{
	return a+b
}
```

测试函数
```ts
import {add} from 'add.ts'

test('加法',()=>{
	expect(add(1,2)).toBe(3)
})
```

1. test：测试函数，第一个参数是测试名，第二个参数是回调函数，在里面执行测试的逻辑
2. expect：传入要被测试的函数及其参数
3. toBe：传入期望的值，如果expect接收到的值与toBe中的值不符就会报错（测试未通过），如果相同则测试通过。绝对相等，是地址的比较，如果两个对象的数据一样，是浅拷贝的话就可以通过测试，深拷贝关系就无法通过测试
4. toEqual：和toBe类似，是值的比较，只要值相等就可以通过测试
5. toBeNull：不需要传入参数，如果expect接收的值为null就通过测试
6. toBeUndefined：匹配undefined
7. toBeDefined：匹配有定义的值
8. toBeTruthy：匹配的值如果转成布尔类型是true就可以通过测试
9. toBeFalsy：匹配的值转成布尔类型是false可以通过测试
10. toBeGreaterThan：匹配的值大于传递的值就可以通过
11. toBeLessThan：匹配的值小于传递的值就可以通过
12. toBeGreaterOrEqual：匹配的值大于等于传递的值就可以通过
13. toBeCloseTo：和toBe相同但解决了浮点数精度问题
14. toMatch：匹配的字符串中有传入的字符串就通过
15. toContain：匹配的数组中有传入的元素就通过

test中only定义的单元测试会会跳过其他同级的单元测试，只测试only声明的
```ts
test.only('1',()=>{})
```
# 生命周期函数
- beforeAll：在所有测试用例之前执行
- beforeEach：在每个测试用例执行前都会执行
- afterEach：在每个测试用例执行完成后都会执行
- afterAll：在所有测试用例执行完成后执行

# 分组
多个方法共同测试时查看起来比较混乱，可以将逻辑相关的测试分为同一组中
```ts
describe('分组1',()=>{
	test('测试1',()=>{
		// ...
	})
	test('测试2',()=>{
		// ...
	})
})
```
在分组后对于在生命周期中的执行逻辑也是分组在上的先执行
