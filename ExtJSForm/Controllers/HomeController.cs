using ExtJSForm.ExtJs;
using ExtJSForm.ExtJsExtension;
using ExtJSForm.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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

    }
}