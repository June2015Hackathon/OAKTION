using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Oaktio.Model
{
    class RelatedParty
    {
        public string id { get; set; }
        public string href { get; set; }
        public string role { get; set; }
        /*
           "id": "any party identifer",
           "href": "http//.../party/42",
           "role": "role"
          * */
    }
}
