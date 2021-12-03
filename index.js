/*
 * Copyright 2021 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
    "use strict";

    window.addEventListener("load", onWindowLoad);

    function addBlockSwitches() {
        for (var primary of document.querySelectorAll(".primary")) {
            var switchItem = createSwitchItem(primary, createBlockSwitch(primary));
            switchItem.item.classList.add("selected");
            var title = primary.querySelector(".title");
            title.remove();
        }
        for (var secondary of document.querySelectorAll(".secondary")) {
            var primary = findPrimary(secondary);
            if (primary === null) {
                console.error("Found secondary block with no primary sibling");
            } else {
                var switchItem = createSwitchItem(
                    secondary,
                    primary.querySelector(".switch")
                );
                switchItem.content.classList.add("hidden");
                primary.append(switchItem.content);
                secondary.remove();
            }
        }
    }

    function createElementFromHtml(html) {
        var template = document.createElement("template");
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function createBlockSwitch(primary) {
        var blockSwitch = createElementFromHtml('<div class="switch"></div>');
        primary.prepend(blockSwitch);
        return blockSwitch;
    }

    function findPrimary(secondary) {
        var candidate = secondary.previousElementSibling;
        while (candidate != null && !candidate.classList.contains("primary")) {
            candidate = candidate.previousElementSibling;
        }
        return candidate;
    }

    function createSwitchItem(block, blockSwitch) {
        var blockName = block.querySelector(".title").textContent;
        var content = block.querySelectorAll(".content").item(0);
        var colist = nextSibling(block, ".colist");
        if (colist != null) {
            content.append(colist);
        }
        var item = createElementFromHtml(
            '<div class="switch--item">' + blockName + "</div>"
        );
        item.dataset.blockName = blockName;
        content.dataset.blockName = blockName;
        blockSwitch.append(item);
        return { item: item, content: content };
    }

    function nextSibling(element, selector) {
        var sibling = element.nextElementSibling;
        while (sibling) {
            if (sibling.matches(selector)) {
                return sibling;
            }
            sibling = sibling.nextElementSibling;
        }
    }

    function globalSwitch() {
        document.querySelectorAll(".switch--item").forEach(function(item) {
            var blockId = blockIdForSwitchItem(item);
            var handler = function(event) {
                var selectedText = event.target.textContent;
                window.localStorage.setItem(blockId, selectedText);
                for (var switchItem of document.querySelectorAll(".switch--item")) {
                    if (
                        blockIdForSwitchItem(switchItem) === blockId &&
                        switchItem.textContent === selectedText
                    ) {
                        select(switchItem);
                    }
                }
            };
            item.addEventListener("click", handler);
            if (item.textContent === window.localStorage.getItem(blockId)) {
                select(item);
            }
        });
    }

    function select(selected) {
        for (var child of selected.parentNode.children) {
            child.classList.remove("selected");
        }
        selected.classList.add("selected");
        for (var child of selected.parentNode.parentNode.children) {
            if (child.classList.contains("content")) {
                if (selected.dataset.blockName === child.dataset.blockName) {
                    child.classList.remove("hidden");
                } else {
                    child.classList.add("hidden");
                }
            }
        }
    }

    function blockIdForSwitchItem(item) {
        var idComponents = [];
        for (var switchItem of item.parentNode.querySelectorAll(".switch--item")) {
            idComponents.push(switchItem.textContent.toLowerCase());
        }
        return idComponents.sort().join("-");
    }

    function onWindowLoad() {
        addBlockSwitches();
        globalSwitch();
    };
})();