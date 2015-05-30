using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Oaktio.Model
{
    class Note
    {
        public DateTime date { get; set; }
        public string author { get; set; }
        public string text { get; set; }
        /*
         *  "date": "2015-04-14T17:14:29.855+0000",
           "author": "author",
           "text": "text"
         */
    }
}
