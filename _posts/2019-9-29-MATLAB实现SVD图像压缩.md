---
title: MATLAB实现SVD图像压缩
teaser: 利用SVD分解对图像进行压缩
category: MATLAB
tags: [图像压缩, SVD分解]
---

这是在学习数值代数时的一个homework，感觉还挺有趣的，在这里记录一下。

## SVD分解

首先， <a href="https://www.codecogs.com/eqnedit.php?latex=\inline&space;\dpi{150}&space;\tiny&space;A=U\Sigma&space;V^{T}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;\tiny&space;A=U\Sigma&space;V^{T}" title="\tiny A=U\Sigma V^{T}" /></a> ，其中
U和V是标准正交矩阵，而 <a href="https://www.codecogs.com/eqnedit.php?latex=\inline&space;\dpi{150}&space;\tiny&space;\Sigma" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;\tiny&space;\Sigma" title="\tiny \Sigma" /></a> 是一个
对角矩阵，每一个对角元是矩阵A的特征值的平方根。而且任意一个矩阵都存在SVD分解。

## 代码实现

<mark>图片得是灰度图，普通图片进行到SVD分解时会报错，因为输入矩阵必须为2维。
```
a = imshow('12.png');                  %  读入图片
decm(a)  
  
function [  ] = decm( a )
%UNTITLED 此处显示有关此函数的摘要
%   此处显示详细说明
[u,v,z] = svd(double(a));
b = rank(u);
c = rank(v);
d = rank(z);
m = min(min(b,c),d);     %   用三个矩阵中最小的秩来实现低秩逼近，也可以自定义数字
p = 0;
for i = 1 : m
    q = v(i,i)*u(:,i)*z(:,i)';
    p= p + q;
end
imshow(p)                 % 展示新图片
end
```

原图像

<img src="https://raw.githubusercontent.com/loki-pup/lokiphoto/master/12.png" width="100%" height="100%" />

新图像

<img src="https://raw.githubusercontent.com/loki-pup/lokiphoto/master/3.png" width="100%" height="100%" />
