import uniqid from "uniqid";
export default class List {
  constructor() {
    this.items = [];
  }
  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item; //good practice
  }
  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    //[2,4,8] splice(1,2)->returns[4,8] original arr is[2]
    //[2,4,8] slice(1,2)->returns[4,] original arr is[2,4,8]
    //[2,4,8] splice(1,1)->returns nothing original arr is[2,4,8]
    //slice->starting index-ending index(not included)
    //splice->starting index till how many elements we want to del
    this.items.splice(index, 1);
  }
  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount;
  }
}
