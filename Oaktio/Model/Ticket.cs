using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Oaktio.Model
{
    class Ticket
    {
        public string pseudo { get; set; }
        public string description { get; set; }
        public DateTime date { get; set; }
        public double longitude { get; set; }
        public double latitude { get; set; }
        public string category { get; set; }
    }
}
