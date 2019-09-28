---
title: MATLAB实现SVD图像压缩
teaser: 利用SVD分解对图像进行压缩
category: MATLAB
tags: [图像压缩, SVD分解]
---

这是在学习数值代数时的一个homework，感觉还挺有趣的，在这里记录一下。

## SVD分解：

首先， <a href="https://www.codecogs.com/eqnedit.php?latex=\inline&space;\dpi{150}&space;\tiny&space;A=U\Sigma&space;V^{T}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;\tiny&space;A=U\Sigma&space;V^{T}" title="\tiny A=U\Sigma V^{T}" /></a> ,其中
U和V是标准正交矩阵，而 <a href="https://www.codecogs.com/eqnedit.php?latex=\inline&space;\dpi{150}&space;\tiny&space;\Sigma" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;\tiny&space;\Sigma" title="\tiny \Sigma" /></a> 是一个
对角矩阵，每一个对角元是矩阵A的特征值的平方根。而且任意一个矩阵都存在SVD分解。

## 代码实现
```

```
