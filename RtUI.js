const RtUI = (() => {

  const initialize = (rootElem) => {
    return new Promise((resolve) => {
      document.addEventListener("DOMContentLoaded", async () => {
        const rootData = await treeMap(rootElem);
        resolve(rootData);
      });
    });
  };

  const treeMap = (rootElem) => {
    return new Promise((resolve) => {
      const root = document.getElementById(rootElem);

      const traverseDOM = (element, parentPath) => {
        const elementData = {
          tag: element.tagName,
          attributes: {},
          children: [],
        };

        const id = ID();
        elementData.attributes["data-id"] = id;

        const path = parentPath ? [...parentPath, id] : [id];
        elementData.attributes["data-path"] = path;

        element.setAttribute("data-id", id);

        Array.from(element.attributes).forEach((attr) => {
          elementData.attributes[attr.name] = attr.value;
        });

        Array.from(element.children).forEach((childElement) => {
          const childData = traverseDOM(childElement, path);
          elementData.children.push(childData);
        });

        allDepend(elementData.attributes);

        return elementData;
      };

      const rootData = traverseDOM(root, null);
      resolve(rootData);
    });
  };

    const allDepend = (attrs) => {
    if (JSON.stringify(attrs) !== "{}") {
      Object.keys(attrs).forEach((attr) => {
        if (attr === "data-text") {
          const domElem = document.querySelector(`[data-id="${attrs["data-id"]}"]`);
          const value = attrs[attr];
          const nestedKeys = value.split(".");
          let storeValue = initStore.getValues();
          nestedKeys.forEach((key, index) => {
            if (!storeValue[key]) {
              if (index === nestedKeys.length - 1) {
                let itiValue = null;
                if (domElem.textContent !== '') {
                  itiValue = domElem.textContent;
                }
                storeValue[key] = useState(itiValue);
                storeValue[key].setDepens(attrs["data-id"]);
              } else {
                storeValue[key] = {};
              }
            } else if (index === nestedKeys.length - 1) {
              storeValue[key].setDepens(attrs["data-id"]);
            }
  
            storeValue = storeValue[key];
          });
        }
        // механизм эвенетлистенеров. Название одной и той же переменнной может быть в листенере и обработчике, и в переменной
        // if (attr === "data-input") {
        //   initStore.setValue(attrs[attr], useState(null));
        //   initStore.getValues()[attrs[attr]].setDepens(attrs["data-input"]);
        //   const elem = document.querySelector(`[data-id="${attrs["data-id"]}"]`);
        //   elem.addEventListener("change", (event) => initStore.getValues()[attrs[attr]].setValue(event.target.value));
        // }
      });
    }
  };


  const startApp = (rootElem) => {};

  const ID = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }

    return id;
  };

  const createStore = () => {
    let values = {};
    const setValue = (key, value) => {
      values = {
        ...values,
        [key]: value,
      };
    };
    const getValues = () => {
      return values;
    };
    return {
      setValue,
      getValues,
    };
  };

  const initStore = createStore();

  const useState = (value) => {
    let callback = null;
    const depens = [];
  
    const setValue = (newValue) => {
      this.value = newValue;
      bulkRefresh(depens, "textContent", this.value);
  
      if (callback) {
        callback(this.value);
      }
    };
  
    const setDepens = (newValue) => {
      depens.push(newValue);
    };
  
    const setCallback = (callbackFn) => {
      callback = callbackFn;
    };
  
    return {
      setValue,
      setDepens,
      setCallback,
      value
    };
  };

  const refresh = (id, attr, value) => {
    elem = getById(id);
    elem[attr] = String(value);
  };

  const bulkRefresh = (array, attr, value) => {
    array.forEach((elem) => refresh(elem, attr, value));
  };

  const reRender = () => {
    //должен проверять по карте состояний, какие объекты стали       видимыми и при изменениях перестраивать
    //посмотреть, какая функция выдаст разницу между объектами
  };

  const getById = (dataId) => {
    return document.querySelector(`[data-id="${dataId}"]`);
  };

  const setDependency = () => {};
  const addListener = () => {};
  const fillTree = () => {};
  const valuesListener = () => {};
  const handlers = () => {};

  return {
    useState: useState,
    treeMap: treeMap,
    store: initStore,
    init: initialize,
  };
})();
