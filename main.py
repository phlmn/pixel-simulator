from kivy.app import App
from kivy.uix.widget import Widget
from kivy.properties import ObjectProperty, NumericProperty
from kivy.vector import Vector
from kivy.clock import Clock


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


class PixelGame(Widget):
    def __init__(self):
        Widget.__init__(self)

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

    def on_touch_move(self, touch):
        pass


class PixelApp(App):
    def build(self):
        game = PixelGame()
        Clock.schedule_interval(game.update, 1.0 / 60.0)
        return game


if __name__ == '__main__':
    PixelApp().run()
