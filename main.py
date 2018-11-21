from kivy.app import App
from kivy.uix.widget import Widget
from kivy.uix.button import Button
from kivy.uix.slider import Slider
from kivy.properties import ObjectProperty, NumericProperty
from kivy.vector import Vector
from kivy.clock import Clock
from kivy.core.window import Window
import random


class Pixel(Widget):
    r = NumericProperty(1)
    g = NumericProperty(0)
    b = NumericProperty(1)

    def __init__(self, x, y): 
        Widget.__init__(self)
        self.x = x * (self.width + 10)
        self.y = y * (self.height + 10)

    def update(self, dt):
        pass

    def set_color(self, r, g, b):
        self.r = r
        self.g = g
        self.b = b
    
    


class PixelGame(Widget):
    def __init__(self):
        Widget.__init__(self)

        self._keyboard = Window.request_keyboard(self.keyboard_closed, self)
        self._keyboard.bind(on_key_down=self.on_keyboard_down)

        self.slider_r=Slider(value=1.0, min=0.0,max=1.0,x = 800, y = 300, width = 200)
        self.slider_g=Slider(value=1.0, min=0.0,max=1.0,x = 800, y = 200, width = 200)
        self.slider_b=Slider(value=1.0, min=0.0,max=1.0,x = 800, y = 100, width = 200)
        self.add_widget(self.slider_r)
        self.add_widget(self.slider_g)
        self.add_widget(self.slider_b)

        self.grid = []


        for y in range(10):
            row = []
            for x in range (10):
                row.append(Pixel(x, y))
            self.grid.append(row)

        for row in self.grid:
            for pixel in row:
                self.add_widget(pixel)

    def update(self, dt):
        for row in self.grid:
            for pixel in row:
                pixel.update(dt)
                pixel.set_color(self.slider_r.value, self.slider_g.value, self.slider_b.value)

    def on_keyboard_down(self, keyboard, keycode, text, modifiers):
        pass
        
    def keyboard_closed(self):
        pass


class PixelApp(App):
    def build(self):
        game = PixelGame()
        Clock.schedule_interval(game.update, 1.0 / 60.0)
        return game


if __name__ == '__main__':
    PixelApp().run()
