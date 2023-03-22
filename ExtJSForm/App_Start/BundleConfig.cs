using System.Web;
using System.Web.Optimization;

namespace ExtJSForm
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",

                      "~/Extjs/packages/theme-triton/resources/theme-triton-all.css",
                      "~/Extjs/build/packages/charts/classic/triton/resources/charts-all.css",
                      "~/Content/ExtExtension.css"
                      
                      ));

            bundles.Add(new ScriptBundle("~/bundles/extJSLib").Include(
                        "~/Extjs/build/ext-all-debug.js",
                        "~/Extjs/build/ext-all.js",
                        "~/Scripts/lib/sch-all.js",
                        "~/Extjs/build/packages/ext-locale/build/ext-locale-pt_BR-debug.js",
                        "~/Extjs/build/packages/ext-locale/build/ext-locale-pt_BR.js",
                        "~/Scripts/lib/ExtExtension.js"
                      
                        ));

            bundles.Add(new StyleBundle("~/bundles/appjs").IncludeDirectory("~/Scripts/JSExtjs", "*.js", true));

        }
    }
}
