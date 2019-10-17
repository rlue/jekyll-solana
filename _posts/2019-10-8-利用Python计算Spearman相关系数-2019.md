---
title: 利用Python计算Spearman相关系数
teaser: 非调用函数，针对array和list的实现
category: Python
tags: [Spearman相关系数]
---

自己编程实现Spearman相关系数的计算。

## Spearman相关系数

Spearman相关系数是一种秩相关系数。数据的秩简单来说就是该样本数据的次序统计量。秩统计量是基于样本值的
大小在全体样本中所占位次(秩)的统计量

例：有样本数据-0.8, -3.1, 1.1, -5.2, 4.2，次序统计量的值是-5.2, -3.1, -0.8, 1.1, 4.2，则秩统计量的取值是3,2,4,1,5。

若观测数据中两个值相等，则秩取为它们应排序位置的平均值。 

例：有样本数据-0.8,, -3.1, -0.8，秩为2.5, 1, 2.5。

Spearman相关系数计算公式：<a href="https://www.codecogs.com/eqnedit.php?latex=\inline&space;\dpi{150}&space;\tiny&space;q_{xy}&space;=&space;1&space;-&space;\frac{6}{n(n^{2}&space;-&space;1)}\sum_{i=1}^{n}d_{i}^{2}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;\tiny&space;q_{xy}&space;=&space;1&space;-&space;\frac{6}{n(n^{2}&space;-&space;1)}\sum_{i=1}^{n}d_{i}^{2}" title="\tiny q_{xy} = 1 - \frac{6}{n(n^{2} - 1)}\sum_{i=1}^{n}d_{i}^{2}" /></a>

其中<a href="https://www.codecogs.com/eqnedit.php?latex=\inline&space;\dpi{150}&space;\tiny&space;d_{i}&space;=&space;R_{i}&space;-&space;S_{i},&space;i&space;=&space;1,2,...,n" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;\tiny&space;d_{i}&space;=&space;R_{i}&space;-&space;S_{i},&space;i&space;=&space;1,2,...,n" title="\tiny d_{i} = R_{i} - S_{i}, i = 1,2,...,n" /></a>
，Ri是X的秩统计量，Si是Y的秩统计量，Spearman相关系数定义为这两组秩统计量的相关系数。

## 拆解任务
* 读入数据
* 排序
* 第一次计算秩统计量
* 查找是否有相等数据，纠正次序统计量
* 计算Spearman相关系数

## 排序

array形式
```
da2 = pd.read_excel(fb,header = None)
da3 = da2.values                            #将pd格式转换成数组
row = da2.shape[0]
col = da2.shape[1]

sa1 = np.sort(da3[:,0])                     #数据排序
sa2 = np.sort(da3[:,1])
sb1 = da3[:,0]
sb2 = da3[:,1]
pr = np.ones((1,row))
ps = np.ones((1,row))
```

list形式
```
wb = xlrd.open_workbook(r'C:\Users\LENOVO\Documents\Tencent Files\973391860\FileRecv\eg1d9data.xls')#打开文件
sheet1 = wb.sheet_by_index(0)#通过索引获取表格
x1 = sheet1.col_values(0)
x2 = sheet1.col_values(0)      #不可直接x2=x1，这样会变成创建副本，x2跟着x1变   
  
y1 = sheet1.col_values(1)
y2 = sheet1.col_values(1) #获取列内容

n = len(x1)
x1.sort()           #排序
y1.sort()
pr = np.ones((1,n))
ps = np.ones((1,n))
```
<mark>不可直接x2=x1，这样会变成创建副本，x2跟着x1变  

## 第一次计算秩统计量

array形式
```
for i in range(row):
    [c]=np.where(sa1==sb1[i])
    [d] = np.where(sa2==sb2[i])                     #确定元素位置
    pr[0][i] = c[0]
    ps[0][i] = d[0]
```
np.where返回的是元组形式，要获取元组数据，应用[]来获取

list形式
```
for i in range(n):
    sx = sx + np.square(x2[i] - mx)
    sy = sy + np.square(y2[i] - my)       
    sz = sz + (x2[i]-mx)*(y2[i]-my)
    pr[0][i] = x1.index(x2[i])                 #获取秩统计量，此处因数据为列表形式，故用此方法，数组另有方法
    ps[0][i] = y1.index(y2[i])                 #列表对于重复元素，只能获取第一个出现元素的索引，而数组可以一次获取，但数组获取返回的是元组形式
```

## 纠正次序统计量

array形式
```
def findrank(x1,z):    
    repeat =[item for item, count in Counter(x1).items() if count > 1]       # 找重复元素
    rcount = [count for item, count in Counter(x1).items() if count > 1]     #找重复次数
    nr = len(repeat)      
    for j in range(nr):                          #处理重复元素的秩统计量
        [a] = np.where(x1==repeat[j])
        m = rcount[j]
        b = sum(a)/m
        for k in range(m):
            [d,c] = np.where(z==a[k])
            z[0][c] = b
```

list形式
```
def findrank(x1,z):    
    repeat =[item for item, count in Counter(x1).items() if count > 1]       # 找重复元素
    rcount = [count for item, count in Counter(x1).items() if count > 1]     #找重复次数
    nr = len(repeat)      
    for j in range(nr):                          #处理重复元素的秩统计量
        a = x1.index(repeat[j])
        m = rcount[j]
        b = (m*a+(m-1)*m/2)/m
        [d,c] = np.where(z==a)
        z[0][c] = b
```

## 计算Spearman相关系数

这里array和list的代码没有区别。
array形式
```
findrank(sa1,pr)  
findrank(sa2,ps)

qxy = 0
for i in range(row):
    qxy = qxy + np.square(pr[0][i] - ps[0][i])                        #计算spearman
qxy = 1 - 6/row/(np.square(row)-1)*qxy 
print(qxy)
```

list形式
```
findrank(x1,pr) 
findrank(y1,ps)
qxy = 0
for i in range(n):
    qxy = qxy + np.square(pr[0][i] - ps[0][i])                        #计算spearman
qxy = 1 - 6/n/(np.square(n)-1)*qxy 
```

## 完整代码

array形式
```
##数组形式
fb = r'C:\Users\LENOVO\Documents\Tencent Files\973391860\FileRecv\eg1d9data.xls'
da2 = pd.read_excel(fb,header = None)
da3 = da2.values
row = da2.shape[0]
col = da2.shape[1]

sa1 = np.sort(da3[:,0])
sa2 = np.sort(da3[:,1])
sb1 = da3[:,0]
sb2 = da3[:,1]                                   # 排序
pr = np.ones((1,row))
ps = np.ones((1,row))


for i in range(row):
    [c]=np.where(sa1==sb1[i])
    [d] = np.where(sa2==sb2[i])                     #第一次计算秩统计量
    pr[0][i] = c[0]
    ps[0][i] = d[0]

def findrank(x1,z):    
    repeat =[item for item, count in Counter(x1).items() if count > 1]       # 找重复元素
    rcount = [count for item, count in Counter(x1).items() if count > 1]     #找重复次数
    nr = len(repeat)      
    for j in range(nr):                          #处理重复元素的秩统计量
        [a] = np.where(x1==repeat[j])
        m = rcount[j]
        b = sum(a)/m
        for k in range(m):
            [d,c] = np.where(z==a[k])
            z[0][c] = b

            
findrank(sa1,pr)  
findrank(sa2,ps)

qxy = 0
for i in range(row):
    qxy = qxy + np.square(pr[0][i] - ps[0][i])                        #计算spearman
qxy = 1 - 6/row/(np.square(row)-1)*qxy 
print(qxy)
```

list形式
```
wb = xlrd.open_workbook(r'C:\Users\LENOVO\Documents\Tencent Files\973391860\FileRecv\eg1d9data.xls')#打开文件
sheet1 = wb.sheet_by_index(0)#通过索引获取表格
x1 = sheet1.col_values(0)
x2 = sheet1.col_values(0)      #不可直接x2=x1，这样会变成创建副本，x2跟着x1变   
  
y1 = sheet1.col_values(1)
y2 = sheet1.col_values(1)#获取列内容

n = len(x1)
x1.sort()           #排序
y1.sort()
pr = np.ones((1,n))
ps = np.ones((1,n))
for i in range(n):
    sx = sx + np.square(x2[i] - mx)
    sy = sy + np.square(y2[i] - my)       
    sz = sz + (x2[i]-mx)*(y2[i]-my)
    pr[0][i] = x1.index(x2[i])                 #获取秩统计量，此处因数据为列表形式，故用此方法，数组另有方法
    ps[0][i] = y1.index(y2[i])                 #列表对于重复元素，只能获取第一个出现元素的索引，而数组可以一次获取，但数组获取返回的是元组形式

def findrank(x1,z):    
    repeat =[item for item, count in Counter(x1).items() if count > 1]       # 找重复元素
    rcount = [count for item, count in Counter(x1).items() if count > 1]     #找重复次数
    nr = len(repeat)      
    for j in range(nr):                          #处理重复元素的秩统计量
        a = x1.index(repeat[j])
        m = rcount[j]
        b = (m*a+(m-1)*m/2)/m
        [d,c] = np.where(z==a)
        z[0][c] = b

findrank(x1,pr) 
findrank(y1,ps)
qxy = 0
for i in range(n):
    qxy = qxy + np.square(pr[0][i] - ps[0][i])                        #计算spearman
qxy = 1 - 6/n/(np.square(n)-1)*qxy 
```

# 计算Spearman矩阵

array形式
```
##数组形式
fb = r'C:\Users\LENOVO\Documents\Tencent Files\973391860\FileRecv\eg1d10data.xls'
da2 = pd.read_excel(fb,header = None)
da3 = da2.values
row = da2.shape[0]
col = da2.shape[1]
q = np.ones((col,col))


for i in range(col):
    for j in range(col):
        sa1 = np.sort(da3[:,i])
        sa2 = np.sort(da3[:,j])
        sb1 = da3[:,i]
        sb2 = da3[:,j]
        pr = np.ones((1,row))
        ps = np.ones((1,row))
        for k in range(row):
            [c]=np.where(sa1==sb1[k])
            [d] = np.where(sa2==sb2[k])
            pr[0][k] = c[0]
            ps[0][k] = d[0]
        findrank(sa1,pr)  
        findrank(sa2,ps)
        
        qxy = 0
        for p in range(row):
            qxy = qxy + np.square(pr[0][p] - ps[0][p])                        #计算spearman
        q[i][j] = 1 - 6/row/(np.square(row)-1)*qxy 

def findrank(x1,z):    
    repeat =[item for item, count in Counter(x1).items() if count > 1]       # 找重复元素
    rcount = [count for item, count in Counter(x1).items() if count > 1]     #找重复次数
    nr = len(repeat)      
    for j in range(nr):                          #处理重复元素的秩统计量
        [a] = np.where(x1==repeat[j])
        m = rcount[j]
        b = sum(a)/m
        for k in range(m):
            [d,c] = np.where(z==a[k])
            z[0][c] = b

print(q)        
```

list形式
```
fb = r'C:\Users\LENOVO\Documents\Tencent Files\973391860\FileRecv\eg1d10data.xls'
da2 = pd.read_excel(fb,header = None)
da3 = da2.values
row = da2.shape[0]
col = da2.shape[1]

def findrank(x1,z):    
    repeat =[item for item, count in Counter(x1).items() if count > 1]       # 找重复元素
    rcount = [count for item, count in Counter(x1).items() if count > 1]     #找重复次数
    nr = len(repeat)      
    for j in range(nr):
        a = x1.index(repeat[j])
        m = rcount[j]
        b = (m*a+(m-1)*m/2)/m
        [d,c] = np.where(z==a)
        z[0][c] = b

        
def getqxy(x1,pr,y1,ps):        
    findrank(x1,pr) 
    findrank(y1,ps)
    qxy = 0
    for i in range(row):
        qxy = qxy + np.square(pr[0][i] - ps[0][i])
    qxy = 1 - 6/n/(np.square(row)-1)*qxy 
    return qxy

pr = np.ones((1,row))
ps = np.ones((1,row)) 
q = np.ones((col,col))
for i in range(col):
    for j in range(col):
        sa1 = da3[:,i].tolist()
        sa2 = da3[:,j].tolist()
        sb1 = da3[:,i].tolist()
        sb2 = da3[:,j].tolist()
        sa1.sort()
        sa2.sort()
        for k in range(row):
            pr[0][k] = sa1.index(sb1[k])                 #获取秩统计量
            ps[0][k] = sa2.index(sb2[k])

        q[i][j] =  getqxy(sa1,pr,sa2,ps)

        
print('my spearman:\n',q)
```
