function _is_object(obj) { return typeof obj == 'object' && !!obj; }

function _keys(obj) { return _is_object(obj) ? Object.keys(obj) : []; }

function _rest(list, num) {
    const _slice = Array.prototype.slice;
    return _slice.call(list, num ?? 1);
}//_rest

function _each(list,iter){
    const keys = _keys(list);
    for(let i=0, len = keys.length; i<len; i++){
        iter(list[keys[i]]);
    }
    return list;
}//_each

function _map(list,mapper){
    const result = [];
    _each(list,function(item){
        result.push(mapper(item));
    });
    return result;
}//_map

function _filter(list,predi){
    const result = [];

    _each(list, function(item){
        if(predi(item)){result.push(item);}
    });

    return result;
}//_filter

function _reduce(list,iter,memo){
    if(arguments.length == 2){
        memo = list[0];
        list = _rest(list);}

    _each(list, function(val){
        memo = iter(memo, val);
    });

    return memo;
}//_reduce

function _curryr(fn){
    return function(a,b){
        return arguments.length == 2 ? fn(a,b) : function(b){return fn(b,a);}
    }
}//_curryr

function _values(data){
    return _map(data, _identity);
}//_values

function _identity(val){return val;}//_identity

const __map = _curryr(_map);
const __values = __map(_identity);

const __get = _curryr(function(obj,key){
    return !obj ? undefined : obj[key];
});

function _pluck(data,key){
    return _map(data, _getr(key));
}//_pluck

function _reject(data,predi){
    // return _filter(data, val => !predi(val));
    return _filter(data, _negate(predi));
}//_reject

const __reject = _curryr(_reject);

function _negate(func){
    return function(val){
        return !func(val);
    }
}//_negate

function _compact(data){
    return _filter(data, _identity);
}//_compact

const __filter = _curryr(_filter);
const __compact = __filter(_identity);

function _find(list, predi){
    const keys = _keys(list);
    for(let i=0, len = keys.length; i<len; i++){
        const val = list[keys[i]];
        if(predi(val)) return val;
    }
}//_find

function _find_index(list,predi){
    const keys = _keys(list);
    for(let i=0, len = keys.length; i<len; i++){
        const val = list[keys[i]];
        if(predi(val)) return i;
    }

    return -1;
}//_find_index

function _get(obj,key){
    return obj ? obj[key] : undefined;
}

function _pipe(){
    const fns = arguments;
    return function(arg){
        // console.log(`arg : ${arg}, fns : ${fns}`);
        return _reduce(fns, function(arg, fn){
            return fn(arg);
        }, arg);
    };
}//_pipe

function _go(arg){
    const fns = _rest(arguments);
    _pipe.apply(null, fns)(arg);
}//_go

const __find = _curryr(_find);

function _some(data, predi){
    return _find_index(data,predi || _identity) !== -1;
}//_some

function _every(data, predi){
    return _find_index(data, _negate(predi || _identity)) == -1;
}//_every

function _min(data){
    return _reduce(data, function(a,b){
        return a < b ? a : b;
    });
}//_min

function _max(data){
    return _reduce(data, function(a,b){
        return a > b ? a : b;
    });
}//_max

function _min_by(data, iter){
    return _reduce(data, function(a,b){
        return iter(a) < iter(b) ? a : b;
    });
}//_min_by

function _max_by(data,iter){
    return _reduce(data, function(a,b){
        return iter(a) > iter(b) ? a : b;
    });
}//_max_by

const __min_by = _curryr(_min_by);
const __max_by = _curryr(_max_by);

const _group_by = _curryr(function(data,iter){
    return _reduce(data, function(grouped, val){
        // const key = iter(val);
        // (grouped[key] = grouped[key] || []).push(val);
        return _push(grouped, iter(val), val);
    },{});
});//_group_by

function _push(obj,key,val){
    (obj[key] = obj[key] || []).push(val);
    return obj;
}

function _head(list){return list[0];}

const _count_by = _curryr(function(data,iter){
    return _reduce(data, function(count, val){
        // const key = iter(val);
        // count[key] ? count[key]++ : count[key] = 1;
        // return count;
        return _inc(count,iter(val));
    }, {});
});

function _inc(count,key){
    count[key] ? count[key]++ : count[key] = 1;
    return count;
}//_inc

function _each2(list,iter){
    const keys = _keys(list);
    for(let i=0, len = keys.length; i<len; i++){
        iter(list[keys[i]],keys[i]);
    }
    return list;
}

function _map2(list,mapper){
    const new_list = [];
    _each2(list, function(val,key){
        new_list.push(mapper(val, key));
    });
    return new_list;
}//_map2

const __map2 = _curryr(_map2);
const __pairs = __map2((val,key)=>[key,val]);