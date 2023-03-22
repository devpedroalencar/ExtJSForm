using System;
using System.Collections.Generic;
using System.Collections;
using System.Web.Script.Serialization;

namespace ExtJSForm.ExtJs
{
        public class ExtJsColumn
    {
        public string text { get; set; }

        public string dataIndex { get; set; }
    }

    [Serializable]
    public class ExtJsStore
    {
        public int? start { get; set; }
        public int? limit { get; set; }
        public int? page { get; set; }
        public string filter { get; set; }
        public string sort { get; set; }
        public string parameter { get; set; }
        public string columns { get; set; }

        public int total { get; set; }
        [NonSerialized]
        public IEnumerable records;
        [NonSerialized]
        public object extObj;

        public object GetReturn(string msg = "", bool success = true)
        {            
            return new { records = this.records, total = this.total, success = success, msg = msg, extObj = extObj };
        }

        public Dictionary<string, string> GetColumnsDictionary()
        {
            if (this.columns != null)
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var columns = serializer.Deserialize<IEnumerable<ExtJsColumn>>(this.columns);

                var dic = new Dictionary<string, string>();

                foreach (var item in columns)
                {
                    dic[item.dataIndex] = item.text;
                }

                return dic;
            }
            return null;
        }
    }
}