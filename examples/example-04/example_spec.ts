'use strict';

const TIME_OUT = 10000;

describe('angularjs homepage', function () {
    it('should greet the named user', function () {
        browser.get('http://www.angularjs.org');

        element(by.model('yourName')).sendKeys('Julie');

        let greeting = element(by.binding('yourName'));

        expect(greeting.getText()).toEqual('Hello Julie!');
    });

    describe('todo list', function () {
        let todoList;

        beforeEach(function () {
            browser.get('http://www.angularjs.org');

            todoList = element.all(by.repeater('todo in todoList.todos'));
        });

        it('should list todos', function () {
            expect(todoList.count()).toEqual(2);
            expect(todoList.get(1).getText()).toEqual('build an angular app');
        });

        it('should add a todo', function () {
            let addTodo = element(by.model('todoList.todoText'));
            let addButton = element(by.css('[value="add"]'));

            addTodo.sendKeys('write a protractor test');
            addButton.click();

            expect(todoList.count()).toEqual(3);
            expect(todoList.get(2).getText()).toEqual('write a protractor test');
        });

        it('should wait until the video tags are shown', function () {
            browser.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.video-img'))), TIME_OUT);

            let videos = element.all(by.css('.video-img'));
            expect(videos.count()).toEqual(2);
        });
    });
});
