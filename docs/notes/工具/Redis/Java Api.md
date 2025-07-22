---
title: 2 Java Api
createTime: 2025/04/05 12:12:26
permalink: /tools/redis/2/
---
# SpringDataRedis

SpringData是Spring中数据操作的模块，包含对各种数据库的集成，其其中对Redis的集成模块就叫做SpringDataRedis

#### 配置
```yml
  data:
    redis:
      host: localhost
      port: 6379
      password: "03604"
      lettuce:
        pool:
          max-active: 8 # 最大连接
          max-idle:  8 # 最大空闲连接
          min-idle: 0 # 最小空闲连接
          max-wait: 100 # 连接等待时间
```

SpringDataRedis中提供了RedisTemplate了各种对ReOIs的操作.：并且将不同数据类型的操作API封装到了不同的类型中：

| API                         | 返回值             | 类型说明            |
| --------------------------- | --------------- | --------------- |
| redisTemplate.opsForValue() | ValueOperations | 操作String类型数据    |
| redisTemplate.opsForHash()  | HashOperations  | 操作Hash类型数据      |
| redisTemplate.opsForList()  | ListOperations  | 操作List类型数据      |
| redisTemplate.opsForSet()   | SetOperations   | 操作Set类型数据       |
| redisTemplate.opsForZSet()  | ZSetOperations  | 操作SortedSet类型数据 |
| redisTemplate               |                 | 通用的命令           |
示例:
```java
@SpringBootTest
class DemoApplicationTests {
	@Autowired
	private RedisTemplate<String,Object> redisTemplate;

	@Test
	void testString(){
		redisTemplate.opsForValue().set("name","zhangsan");
		System.out.println(redisTemplate.opsForValue().get("name"));
	}
}
```

但设置数据后再次查询name键,如果之前没有name就查询不到数据,如果之前有name键那么查询到的是旧的数据而不是新插入的

RedisTemplate可以接收任意Object作为值写入Redis，只不过写入前会把Object序列化为字节形式，默认是采用JDK序列化，得到的结果是这样的：`\xAC\xED\x00\x05t\x00\x04name`
这种方法可读性差且内存占用较大

可以自己指定序列化器,不使用jdk的序列化器

# Jedis
jedis方法操作和redis中的命令一样,但线程不安全


引入依赖
```xml
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>4.3.1</version>
        </dependency>
```

### 使用

```java
public class JedisTest {
  private Jedis jedis;

//建立连接
  @BeforeEach
  void setUp() {
    // 建立连接
    jedis = new Jedis("localhost", 6379);
    // 验证密码
    jedis.auth("123456");
    // 选择数据库
    jedis.select(0);
  }

//操作数据库
  @Test
  void testString() {
    System.out.println(jedis.set("name", "zhangsan"));

    System.out.println(jedis.get("name"));
  }

  @Test
  void testHash(){
    System.out.println(jedis.hset("user:1", "name", "zhangsan"));
    System.out.println(jedis.hset("user:1", "age","21"));
    Map<String, String> map = jedis.hgetAll("user:1");

    System.out.println(map);
  }

//释放连接
  @AfterEach
  void tearDown() {
    // 关闭连接
    if (jedis != null) {
      jedis.close();
    }
  }
}
```

### 数据库连接池
因为jedis是线程不安全的所以推荐使用数据库连接池
jedis提供了自带的数据库连接池,JedisPool
```java
public class JedisConnefctionFactory {
  private static final JedisPool jedisPool;
  static {
    JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();// 最大连接
    jedisPoolConfig.setMaxTotal(8);
    // 最大空闲连接
    jedisPoolConfig.setMaxIdle(8);
    // 最小空闲连接
    jedisPoolConfig.setMinIdle(0);
    // 设置最长等待时间,ms
    jedisPoolConfig.setMaxWaitMillis(200);
    jedisPool = new JedisPool(jedisPoolConfig, "localhost", 6379, 1000, "123321");
  }

  // 获取Jedis对象
  public static Jedis getJedis() {
    return jedisPool.getResource();
  }
}
```
