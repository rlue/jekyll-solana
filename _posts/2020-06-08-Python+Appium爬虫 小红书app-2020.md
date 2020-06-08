---
title: Python+Appium爬虫 小红书app
teaser: app爬虫入门，注意事项
category: Python
tags: [Appium, 爬虫]
---

最近在学习怎么爬手机app，弄了两三天才入了门，其中遇到了很多问题，在这里记录一下。先后用了小红书和闲鱼来测试。

tips:

用的是最新版本的appium，android sdk，java，手机是安卓7.0.

1. 尝试appium连接，结果报错 Stderr: 'java.lang.SecurityException: Permission Denial: starting Intent { flg=0x10000000 cmp=com.xingin.xhs/com.
xingin.alioth.activity.GlobalSearchActivity **launchParam=MultiScreenLaunchParams** { mDisplayId=0 mFlags=0 } } 
from null (pid=13019, uid=2000) not exported from uid，这个大概是因为手机app没有开启照相机权限。

2. appium连接时的appActivity是启动页，而不是首页，就开启app时卡两三秒的页面。获取启动页的appActivity，cmd运行

```
adb shell
monkey -p com.xingin.xhs -v -v -v 1
```
，其中com.xingin.xhs是appPackage。

3. 尝试appium连接，报错无法安装appium-uiautomator2-server-debug-androidTest.apk'' exited with code 1，可以尝试卸载重装app。

4. appium连接时，若需要app保持登录状态，记得设置"noReset": "True"。

5. 爬取小红书帖子标题时，因内含大量emoji，在python ide无法显示，所以会报错
UnicodeEncodeError: 'UCS-2' codec can't encode characters in position 11-11。直接在pycharm运行就没事了。

6. 使用fiddler才需要在手机wifi设置代理服务器。手机USB连接使用appium则不需要，也不需要和电脑连同一个wifi。

## 基本记录
* 先尝试了fiddler，但是个人不太会用，一时间刷过了十几行数据，反正对这个软件也没有弄得太明白。
* 接着上网搜资料，方向转移到appium+夜神模拟器。但刚弄夜神模拟器也不太会，appium那里没有设置“noReset”: True，每次都要登录。
弄烦了，换了部真的Samsung来试。之后再试试模拟器。
* 换了真手机来试，一直无法启动，刚好上网查到了uiautomator viewer，这个就是运行Android sdk文件夹tools里面的uiautomatorviewer.bat。
但是这个运行似乎一定要jdk1.8，我这里最新的jdk运行不了。个人感觉uiautomator viewer是appium的静态版本，一直停留在连接后的手机页面，
要换页面似乎只能断开重连。而且只能uiautomator viewer获得元素的id，无法获得xpath。
* 最后经过多次排查，用appium desktop搞定了最基本的爬虫。


## appium爬虫基本过程

### 配置环境

先下载java，android sdk和appium，并配置环境。具体安装过程可以看这个博主写的，https://www.cnblogs.com/peipei-Study/p/12092054.html。安装后记得
测试一下是否配置成功。python的话，还要安装Appium-Python-Client。


### 前期准备

1. 直接usb连接手机，记得进入开发者模式。然后cmd运行adb devices，会返回List of devices attached和*****  device。******就是设备名称，之后在appium
会用到，deviceName。

2. 在手机打开准备爬虫的app，然后cmd运行

```
adb shell
dumpsys activity | grep mFocusedActivity
```

，会返回...com.xingin.xhs/.index.v2.IndexActivityV2...，斜杆前的那串英文就是appPackage，后面是appActivity，在appium会用到。
个人理解是appPackage说明要运行哪个app，appActivity说明要到app的哪个页面。

3. 打开appium desktop，输入

```
{
  "platformName": "Android",
  "deviceName": "05157df5f51db3",
  "appPackage": "com.xingin.xhs",
  "appActivity": ".activity.SplashActivity",
  "platformVersion": "7.0",     
  "noReset": "True",
  "fullReset": "False"
}
```

，platformVersion是安卓版本。然后start session，连接手机app，并开启录制，然后和平时玩手机一样操控appium。先选择元素，然后tap（点击）
或send keys（输入文字）。我的流程大概就是开始页面，点击搜索框，输入搜索内容，点击搜索，获得搜索结果。开启录制的好处是，可以获得这一系列操作的代码，
不用自己写。


## 完整代码

```
import time
from appium import webdriver
from appium.webdriver.common import mobileby
from appium.webdriver.webdriver import WebDriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import sys

non_bmp_map = dict.fromkeys(range(0x10000, sys.maxunicode + 1), 0xfffd)


desired_capabilities = {
  "platformName": "Android",
  "deviceName": "05157df5f51db3",
  "appPackage": "com.xingin.xhs",
  "appActivity": ".activity.SplashActivity",
  "platformVersion": "7.0",
  "noReset": True,
  "fullReset": False
}

DRIVER_SERVER = 'http://localhost:4723/wd/hub'

class AppiumDemo(object):
    def __init__(self):
        #self.driver = webdriver.Remote(command_executor=desired_capabilities['command_executor'],
                                       #desired_capabilities=desired_capabilities)
        self.driver = webdriver.Remote(DRIVER_SERVER, desired_capabilities=desired_capabilities)                               
        self.by = mobileby.MobileBy()
        
    def test(self):
        el1 = self.driver.find_element_by_id("com.xingin.xhs:id/ak0")   #点击搜索框，打开搜索页
        el1.click()
        #el2 = self.driver.find_element_by_id("com.xingin.xhs:id/al8")    #搜索框输入文字
        el2 = self.wait_find_element(by_type=self.by.ID, value='com.xingin.xhs:id/al8')
        el2.send_keys("tf")
        el3 = self.driver.find_element_by_id("com.xingin.xhs:id/ala")     #点击搜索
        el3.click()
        for i in range(4):
            el5 = self.driver.find_elements_by_id("com.xingin.xhs:id/aj4")
            print(i)
            for j in el5:
                
                try:
                    print('11')
                    print(j.text)
                except:
                    try:
                        print('12')
                        print(str(j.translate(non_bmp_map)))
                    except:
                        print('error')
            self.swipe_up()           
       

    def get_size(self, driver: WebDriver = None):
        """
        获取屏幕大小
        :param driver:
        :return:
        """
        driver = driver or self.driver
        if not driver:
            return driver

        x = driver.get_window_size()['width']
        y = driver.get_window_size()['height']
        return [x, y]

    def swipe_up(self, driver: WebDriver = None, _time: int = 1000):
        """
        向上滑动
        :param driver:
        :param _time:
        :return:
        """
        driver = driver or self.driver
        if not driver:
            return driver
        try:
            size = self.get_size(driver)
            x1 = int(size[0] * 0.5)  # 起始x坐标
            y1 = int(size[1] * 0.80)  # 起始y坐标
            y2 = int(size[1] * 0.30)  # 终点y坐标
            driver.swipe(x1, y1, x1, y2, _time)
            return True
        except:
            return False

def main():
    spider = AppiumDemo()
    spider.test()

if __name__ == '__main__':
    main()
```

运行结果

```
0
11
TF口红必入热门色号‼️黄皮显白✔️女神气场
11
12
error
1
11
TF口红必入热门色号‼️黄皮显白✔️女神气场
11
12
error
11
12
error
11
#TF16 谁涂谁好看 #苹果前置无滤镜试色 #TF16黑管 #汤姆·福特 TOM FORD  最近超爱的一个颜色，超级好看的番茄红，质地滋润但
2
11
12
error
11
#TF16 谁涂谁好看 #苹果前置无滤镜试色 #TF16黑管 #汤姆·福特 TOM FORD  最近超爱的一个颜色，超级好看的番茄红，质地滋润但
11
万元TF白管全套试色，我OMG颜色你一定要买！
11
12
error
3
11
万元TF白管全套试色，我OMG颜色你一定要买！
11
12
error
11
12
error
11
TF黑管新色合集哦｜浓浓的英伦复古感配色～～～
```
