using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web.Script.Serialization;
using ExtJSForm.ExtJs;

namespace ExtJSForm.ExtJsExtension
{
    public static class ExtJsStoreExtension
    {
        public class ExtjsSort
        {
            public string property { get; set; }

            public string direction { get; set; }
        }
        public class ExtjsFilter
        {
            private string _operator = "or";

            public string type { get; set; }

            public string comparison { get; set; }

            public object value { get; set; }

            public string field
            {
                get
                {
                    return property;
                }
                set
                {
                    property = value;
                }
            }

            public string property { get; set; }

            public string Operator
            {
                get
                {
                    return _operator;
                }
                set
                {
                    _operator = value;
                }
            }

            public IEnumerable GetValue()
            {
                if (value == null)
                {
                    return new object[0];
                }

                IEnumerable enumerable = value as IEnumerable;
                Type type = value.GetType();
                if (enumerable == null || type == typeof(string))
                {
                    object obj = value;
                    if (this.type == "boolean" && type != typeof(bool))
                    {
                        obj = false;
                        if (value as string == "true")
                        {
                            obj = true;
                        }
                    }

                    return new object[1] { obj };
                }

                return enumerable;
            }
        }

        public static IEnumerable<T> ExtJsStore<T>(this IEnumerable<T> source, int start, int limit, string filter = null, string sort = null)
        {
            return source.Filter(filter).ApplyOrder(sort).Skip(start).Take(limit);
        }

        public static IEnumerable<T> ExtJsStore<T>(this IEnumerable<T> source, ExtJsStore store, Func<IEnumerable<T>, object> selector = null, bool useFilter = true, IDictionary<string, string> columnsMapping = null)
        {
            if (store != null && source != null)
            {
                try
                {
                    var ret = (useFilter ? source.Filter(store.filter, columnsMapping): source).ApplyOrder(store.sort, columnsMapping);

                    if (selector != null)
                    {
                        store.extObj = selector(ret);
                    }

                    //store.total = ret.Count();

                    IEnumerable<T> list = ret.Skip(store.start ?? 0).ToArray();
                    var count = list.Count();
                    if (count == 0)
                    {
                        store.start = 0;
                        list = ret.ToArray();
                        count = list.Count();
                    }
                    store.total = count + (store.start ?? 0);
                    
                    if (store.limit != null)
                    {
                        list = list.Take(store.limit.Value);
                    }

                    store.records = list;

                    if (selector != null)
                    {
                        store.extObj = selector(list);
                    }

                    return list;
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return source;
        }

        public static IEnumerable<T> Filter<T>(this IEnumerable<T> source, string filter, IDictionary<string, string> columnsMapping = null, bool multiploOr = false)
        {
            if (string.IsNullOrWhiteSpace(filter) || filter == "[]")
            {
                return source;
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            IEnumerable<ExtjsFilter>[] muplipleFilters = null;

            // se for multiplo Or tem mais que um no filtro
            if (multiploOr == false)
            {
                var filters = serializer.Deserialize<IEnumerable<ExtjsFilter>>(filter);
                muplipleFilters = new IEnumerable<ExtjsFilter>[] { filters };
            }
            else
            {
                muplipleFilters = serializer.Deserialize<IEnumerable<ExtjsFilter>[]>(filter);
            }

            var type = typeof(T);

            var nullExpression = Expression.Constant(null);
            var emptyExpression = Expression.Constant(string.Empty);
            var notColumns = new List<string>();

            var arg = Expression.Parameter(type, "x");
            var filterList = new List<Expression>();
            // para cada mulitplo filtro
            foreach (var filters in muplipleFilters)
            {
                // faz mapeamento de colunas, se necessario
                if (columnsMapping != null)
                {
                    foreach (var f in filters)
                    {
                        if (columnsMapping.ContainsKey(f.field))
                        {
                            f.field = columnsMapping[f.field];
                        }

                    }
                }

                List<Expression> arrayFilter = new List<Expression>();
                Dictionary<string, List<Expression>> orColumnFilter = new Dictionary<string, List<Expression>>();
                Dictionary<string, List<Expression>> andColumnFilter = new Dictionary<string, List<Expression>>();
                // para cada filtro
                foreach (var f in filters)
                {
                    // se tiver Operador and definido, usa and entre as colunas, senao usar o or
                    List<Expression> operatorFilter;
                    if ((f.Operator == "gt" || f.Operator == "eq" || f.Operator == "lt"))
                    {
                        if (!andColumnFilter.ContainsKey(f.field)) // quando for mesma coluna, usa OR na coluna
                        {
                            operatorFilter = new List<Expression>();
                            andColumnFilter[f.field] = operatorFilter;
                        }
                        else
                        {
                            operatorFilter = andColumnFilter[f.field];
                        }
                    }
                    else if (f.comparison == "not") // caso tem um filtro com o operador not, deve-se negar o filtro da coluna
                    {
                        notColumns.Add(f.field);
                        continue;
                    }
                    else
                    {
                        if (!orColumnFilter.ContainsKey(f.field)) // quando for mesma coluna, usa OR na coluna
                        {
                            operatorFilter = new List<Expression>();
                            orColumnFilter[f.field] = operatorFilter;
                        }
                        else
                        {
                            operatorFilter = orColumnFilter[f.field];
                        }
                    }

                    if (f.Operator == "in" && !f.value.GetType().IsArray)
                    {
                        f.value = f.value.ToString().Split(',');
                    }

                    // para cada valor dentro do value
                    foreach (var v in f.GetValue())
                    {
                        var t = type.GetProperty(f.field);
                        if (t == null)
                        {
                            continue;
                        }
                        
                        Expression expression1 = null;
                        Expression expression2 = null;
                        Expression extToAdd = null;

                        if (!t.PropertyType.IsGenericType) // pode ser nullable
                        {
                            expression1 = Expression.PropertyOrField(arg, f.field);
                            expression2 = Expression.Constant(Convert.ChangeType(v, t.PropertyType));
                        }
                        else if (v != null)
                        {
                            var exp = Expression.PropertyOrField(arg, f.field);
                            expression1 = Expression.PropertyOrField(exp, "Value");
                            expression2 = Expression.Constant(Convert.ChangeType(v, t.PropertyType.GetGenericArguments()[0]));
                        }
                        else if (f.comparison == "null") // caso o valor seja null e seja generio, usa somente == null
                        {
                            // x == null
                            operatorFilter.Add(Expression.Equal(Expression.PropertyOrField(arg, f.field), nullExpression));
                            continue;
                        }
                        // caso de comparacao com datetime, usa somente o date, o time nao importa
                        if (t.PropertyType == typeof(DateTime) || t.PropertyType == typeof(DateTime?))
                        {
                            expression1 = Expression.PropertyOrField(expression1, "Date");
                            expression2 = Expression.PropertyOrField(expression2, "Date");
                        }

                       // switch (f.comparison)
                        switch (f.Operator)
                        {
                            case "like": // usa x.ToLower().contains("VALOR".ToLower())
                                var exp1 = Expression.Call(expression1, "ToLower", null, new Expression[0]);
                                var exp2 = Expression.Call(expression2, "ToLower", null, new Expression[0]);
                                var possibleNull = Expression.Call(exp1, "Contains", null, exp2);
                                var notNull = Expression.NotEqual(expression1, nullExpression);

                                extToAdd = Expression.AndAlso(notNull, possibleNull);
                                break;
                            case "null": // usa x==null || x == string.Empty
                                extToAdd =
                                    Expression.Or(
                                        Expression.Equal(expression1, nullExpression), // x == null
                                        Expression.Equal(expression1, emptyExpression) // x == ''
                                        );
                                break;
                            case "lt": // x < valor
                                extToAdd = Expression.LessThan(expression1, expression2);
                                break;
                            case "gt": // x > valor
                                extToAdd = Expression.GreaterThan(expression1, expression2);
                                break;
                            case "eq": // x == valor
                            default:
                                extToAdd = Expression.Equal(expression1, expression2);
                                break;
                        }

                        if (t.PropertyType.IsGenericType) // se for genercio tem que comprar se nao eh null p invokar
                        {
                            var notNull = Expression.NotEqual(Expression.PropertyOrField(arg, f.field), nullExpression);
                            extToAdd = Expression.AndAlso(notNull, extToAdd);
                        }

                        operatorFilter.Add(extToAdd);
                    }
                }

                // faz o and se necessario
                foreach (var andFilter in andColumnFilter)
                {
                    if (andFilter.Value.Count > 0)
                    {
                        var and = andFilter.Value[0];
                        for (int i = 1; i < andFilter.Value.Count; i++)
                        {
                            and = Expression.AndAlso(and, andFilter.Value[i]);
                        }
                        if (!orColumnFilter.ContainsKey(andFilter.Key))
                        {
                            orColumnFilter[andFilter.Key] = new List<Expression>();
                        }
                        orColumnFilter[andFilter.Key].Add(and);
                        andFilter.Value.Clear();
                    }
                }
                // faz o ou das colunas
                foreach (var orFilterKey in orColumnFilter.Keys)
                {
                    var orFilter = orColumnFilter[orFilterKey];
                    if (orFilter.Count > 0)
                    {
                        var or = orFilter[0];
                        for (int i = 1; i < orFilter.Count; i++)
                        {
                            or = Expression.Or(or, orFilter[i]);
                        }

                        if (notColumns.Contains(orFilterKey))
                        {
                            or = Expression.Not(or);
                        }

                        arrayFilter.Add(or);
                        orFilter.Clear();
                    }
                }
                // se nao tem nada para filtrar, retorna
                if (arrayFilter.Count == 0)
                {
                    return source;
                }
                // faz o and dos filtros
                var andColumns = arrayFilter[0];
                for (int i = 1; i < arrayFilter.Count; i++)
                {
                    andColumns = Expression.AndAlso(andColumns, arrayFilter[i]);
                }

                filterList.Add(andColumns);
            }

            var filterExp = filterList[0];
            // faz or entre multiplo filtros
            for (int i = 1; i < filterList.Count; i++)
            {
                filterExp = Expression.Or(filterExp, filterList[i]);
            }
            // caso posso reduzir a expressao, reduz
            if (filterExp.CanReduce)
            {
                filterExp = filterExp.Reduce();
            }

            var lambda = Expression.Lambda<Func<T, bool>>(filterExp, arg);
            
            var result = source.Where(lambda.Compile());

            return result;
        }

        public static IEnumerable<T> ApplyOrder<T>(this IEnumerable<T> source, string sort, IDictionary<string, string> columnsMapping = null)
        {
            if (string.IsNullOrWhiteSpace(sort))
            {
                return source;
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var sorts = serializer.Deserialize<IEnumerable<ExtjsSort>>(sort).GetEnumerator();

            if (columnsMapping != null)
            {
                sorts.Reset();
                while (sorts.MoveNext())
                {
                    if (columnsMapping.ContainsKey(sorts.Current.property))
                    {
                        sorts.Current.property = columnsMapping[sorts.Current.property];
                    }

                }
            }


            IOrderedEnumerable<T> ret = null;
            bool first = true;
            sorts.Reset();
            while (sorts.MoveNext())
            {
                ExtjsSort cSort = sorts.Current;
                bool descending = cSort.direction == "DESC" ? true : false;

                PropertyInfo prop = typeof(T).GetProperty(cSort.property);

                if (prop == null)
                {
                    continue;
                }

                if (first)
                {
                    first = false;
                    if (descending)
                    {
                        ret = source.OrderByDescending(x => prop.GetValue(x, null));
                    }
                    else
                    {
                        ret = source.OrderBy(x => prop.GetValue(x, null));
                    }
                }
                else
                {
                    if (descending)
                    {
                        ret = ret.ThenBy(x => prop.GetValue(x, null));
                    }
                    else
                    {
                        ret = ret.ThenByDescending(x => prop.GetValue(x, null));
                    }
                }
            }

            return ret ?? source;
        }
    }
}