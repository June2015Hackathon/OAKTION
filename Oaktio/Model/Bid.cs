using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Oaktio.Model
{
    class Bid
    {
        public string id { get; set; }
        public string version { get; set; }
        public string href { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public List<Category> category { get; set; }
        public SubInfos productSpecification { get; set; }
        public List<SubInfos> place { get; set; }
    }
}
