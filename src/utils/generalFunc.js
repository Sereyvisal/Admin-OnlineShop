import { deleteFile } from "@/api/generalAPI";
import serverConfig from "@/utils/serverConfig";
import bcrypt from "bcryptjs";

export function hashPwd(pwd) {
    return bcrypt.hashSync(pwd, bcrypt.genSaltSync(10));
}

export async function validatePwd(pwd, dbPwd) {
    return bcrypt.compare(pwd, dbPwd);
}

export function removeFile(md5) {
    if (urlImg(md5)) {
        return deleteFile(md5);
    }
    else {
        return false;
    }
}

export function urlImg(md5) {
    return typeof md5 === typeof "";
}

export function checkAvatar(item, key) {
    if (item[key] != "" || item[key] != undefined) {
        return item[key];
    }
    else {
        return serverConfig.blank_profile_img;
    }
};

export function FilterChild(parent, child, list) {
    if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
            list.push({
                text: parent + child[i].name,
                value: child[i]._id,
            });
            if (child[i].items != null) {
                FilterChild(
                    parent + child[i].name + " / ",
                    child[i].items,
                    list
                );
            }
        }
    }

    return list;
}

export function findSelected(list, id) {
    let dept = undefined;
    for (let i = 0; i < list.length; i++) {
        if (list[i]._id == id) {
            return list[i];
        }
        dept = findSelected(list[i].items, id);
        if (dept != undefined) {
            break;
        }
    }
    return dept;
}

export async function deleteNestedChild(item, func) {
    if (item.items.length) {
        for (let i = 0; i < item.items.length; i++) {
            await deleteNestedChild(item.items[i], func);
        }
    }

    await func(item.id);
};

export function getTreePath(k, array) {
    const path = [];
  
    if (
      k > array.length - 1 ||
      !array[k] ||
      !array[k].value ||
      array[k].value < 1
    ) {
      return path;
    }
  
    for (let i = 0; i < array[k].value.length; i++) {
      const child = getTreePath(k + 1, array);
  
      if (child.length < 1) {
        const item = {};
  
        item[array[k].key] = array[k].value[i];
  
        path.push(item);
      } else {
        for (let j = 0; j < child.length; j++) {
          const ni = JSON.parse(JSON.stringify(child[j]));
  
          ni[array[k].key] = array[k].value[i];
  
          path.push(ni);
        }
      }
    }
    return path;
}
  
export function getProductAttribute(item) {
    var attr = "";
    var keyNames = Object.keys(item);
    for (var j = 0; j < keyNames.length; j++) {
        var key = Object.keys(item)[j];
        var value = item[key];

        attr += key + ": " + value;
        j == keyNames.length - 1 ? "" : (attr += ", ");
    }

    return attr;
}