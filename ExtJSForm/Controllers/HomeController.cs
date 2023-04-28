using ExtJSForm.ExtJs;
using ExtJSForm.ExtJsExtension;
using ExtJSForm.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;

namespace ExtJSForm.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult listaDadosExtWindow(ExtJsStore store)
        {

            var entities = new extjsformEntities();

            var dados = entities.infoextjsform.Select(t => new
            {
                t.idInfoExtJS,
                t.nome,
                t.data,
                t.idade
            }).ExtJsStore(store);

            return Json(store.GetReturn(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult salvaDadosExtWindow(string nome, DateTime data, int idade)
        {
            try
            {
                var entities = new extjsformEntities();

                var table = new infoextjsform();
                table.nome = nome;
                table.data = data;
                table.idade = idade;
                entities.AddToinfoextjsform(table);
                entities.SaveChanges();


                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public JsonResult excluiDadosExtWindow(int idInfoExtJS)
        {
            try
            {
                var entities = new extjsformEntities();

                var linha = entities.infoextjsform.Where(t => t.idInfoExtJS == idInfoExtJS).SingleOrDefault();

                entities.DeleteObject(linha);
                entities.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }

        }


        #region metodos da Tree

        public class Node
        {
            public int id_tree { get; set; }
            public string text { get; set; }
            public int? parent_id { get; set; }
            public ICollection<Node> Children { get; set; }
            public bool leaf { get; set; }
            public bool expanded { get; set; }
        }

        public JsonResult LoadNodes(int? id_tree)
        {
            var nodes = new List<Node>();

            // If id is null, it means it's the first request to load the tree
            if (!id_tree.HasValue)
            {
                nodes = GetParentNodes();


            }
            else
            {
                nodes = GetChildNodes(id_tree.Value);
            }

            return Json(nodes, JsonRequestBehavior.AllowGet);
        }

        private List<Node> GetParentNodes()
        {
            var nodes = new List<Node>();

            using (var db = new extjsformEntities())
            {
                var parents = db.tree_extjs.Where(t => t.parent_id == null).ToList();

                foreach (var parent in parents)
                {
                    var node = new Node
                    {
                        id_tree = parent.id_tree,
                        text = parent.nome,
                        leaf = !db.tree_extjs.Any(t => t.parent_id == parent.id_tree),
                        expanded = false,
                        Children = new List<Node>(),
                        parent_id = parent.parent_id
                    };

                    nodes.Add(node);
                }
            }

            return nodes;
        }

        private List<Node> GetChildNodes(int parent_id)
        {
            var nodes = new List<Node>();

            using (var db = new extjsformEntities())
            {
                var children = db.tree_extjs.Where(c => c.parent_id == parent_id).ToList();

                foreach (var child in children)
                {
                    var node = new Node
                    {
                        id_tree = child.id_tree,
                        text = child.nome,
                        leaf = !db.tree_extjs.Any(t => t.parent_id == child.id_tree),
                        expanded = false
                    };

                    nodes.Add(node);
                }
            }

            return nodes;
        }

        public JsonResult salvaDadosTree(int? parent_id, string nome)
        {
            var linhaTabela = new tree_extjs();
            linhaTabela.nome = nome;
            linhaTabela.parent_id = parent_id > 0 ? parent_id : null;

            using (var db = new extjsformEntities())
            {
                db.AddTotree_extjs(linhaTabela);
                db.SaveChanges();
            }

            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deletaRegistroTree(int id_tree)
        {
            try
            {
                using (var db = new extjsformEntities())
                {
                    var linha = db.tree_extjs.Where(t => t.id_tree == id_tree).SingleOrDefault();
                    var filhos = linha.tree_extjs1;

                    if (filhos.Count() > 0)
                    {
                        foreach (var filho in filhos)
                        {
                            deletaRegistroTree(filho.id_tree);
                        }
                    }

                    db.DeleteObject(linha);
                    db.SaveChanges();                  
                }

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex )
            {

                throw ex;
            }
        }

        #endregion

    }
}