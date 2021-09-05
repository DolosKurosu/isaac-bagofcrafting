"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const { toString } = require("lodash");
const BagOfCrafting_1 = require("./BagOfCrafting");
const XmlParser_1 = require("./XmlParser");
let pools = XmlParser_1.XmlParser.loadPools(fs.readFileSync('assets/itempools.xml', 'utf8'));
let meta = XmlParser_1.XmlParser.loadMeta(fs.readFileSync('assets/items_metadata.xml', 'utf8'));
let bc = new BagOfCrafting_1.BagOfCrafting(pools, meta);
let wrongRecipes = BagOfCrafting_1.BagOfCrafting.JsIncorrectRecipes;
let tableOfRecipes = new Set();
let tableOfStoredItems = new Set();
const componentWeightedIndex = {1: 1, 2: 8, 3: 7, 4: 12, 5: 15, 6: 18, 7: 21, 8: 22, 9: 9, 10: 2, 11: 19, 12: 23, 13: 3, 14: 4, 15: 5, 16: 6, 17: 10, 18: 13, 19: 14, 20: 16, 21: 11}
let ItemCounter = new Array();
for (let d = 1; d <= 729; d++) {
    ItemCounter[d] = 0;
}
let list = "";
let count = 0;
let attempts = 0;
for (let a = 1; a <= 11; a++) {
    for (let b = 1; b <= 11; b++) {
        for (let c = 1; c <= 11; c++) {
            for (let d = 1; d <= 21; d++) {
                for (let e = 1; e <= 21; e++) {
                    for (let f = 1; f <= 21; f++) {
                        for (let g = 1; g <= 21; g++) {
                            for (let h = 1; h <= 21; h++) {
                                let components = [componentWeightedIndex[a], componentWeightedIndex[b], componentWeightedIndex[c], componentWeightedIndex[d], componentWeightedIndex[e], componentWeightedIndex[f], componentWeightedIndex[g], componentWeightedIndex[h]].sort(function(x,y){return x-y});
                                attempts++;
                                if (!tableOfRecipes.has(toString(components)) && !wrongRecipes.has(toString(components))) {
                                    let weight = bc.getTotalWeight(components);
                                    if (weight < 36) {
                                        let itemIdForRecipe = bc.calculate(components);
                                        ItemCounter[itemIdForRecipe] += 1;
                                        if (ItemCounter[itemIdForRecipe] > 4) {
                                            tableOfStoredItems.add(itemIdForRecipe);
                                        }
                                        tableOfRecipes.add(toString(components));
                                        let recipeList = bc.getComponentList(components);
                                        if (!tableOfStoredItems.has(itemIdForRecipe)) {
                                            count++;
                                            list += `Recipe ID ${count} = ${itemIdForRecipe} with weight of ${weight} using components${recipeList}.\n`;
                                            console.log(`count = ${count}. attempts = ${attempts}.`);
                                        }
                                        if (count >= 2708) {
                                            fs.writeFileSync('src/bag_of_crafting_recipes.txt', list);
                                            console.log("file written");
                                            let count2 = 0;
                                            for (let v = 1; v <= 729; v++) {
                                                if (ItemCounter[v] == 0) {
                                                    console.log(`${v} is not in the recipe list`);
                                                    count2++;
                                                }
                                            }
                                            console.log(`${count2} items are missing. ${count} total recipes in the set.`)
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}