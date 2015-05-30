using Oaktio.Model;
using Oaktio.View;
using PortableRest;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Windows.Media.Capture;      //For MediaCapture  
using Windows.Media.MediaProperties;  //For Encoding Image in JPEG format  
using Windows.Storage;
using Windows.UI.Xaml.Media.Imaging;
using Windows.Devices.Enumeration;
using System.Net.Http;
using Windows.Devices.Geolocation;   

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=391641

namespace Oaktio
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        Windows.Media.Capture.MediaCapture captureManager;  

        public MainPage()
        {
            this.InitializeComponent();

            this.NavigationCacheMode = NavigationCacheMode.Required;
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.
        /// This parameter is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            // TODO: Prepare page for display here.

            // TODO: If your application contains multiple pages, ensure that you are
            // handling the hardware Back button by registering for the
            // Windows.Phone.UI.Input.HardwareButtons.BackPressed event.
            // If you are using the NavigationHelper provided by some templates,
            // this event is handled for you.
            this.searchBtn.Click += searchBtn_Click;
        }

        async void searchBtn_Click(object sender, RoutedEventArgs e)
        {
            string seeked = this.searchField.Text.Replace(" ", ",");
            string uri = "http://env-0693795.jelastic.servint.net/DSProductCatalog/api/catalogManagement/v2/productOffering?category.name=" + seeked;
            List<Bid> response = await getSearchCallback(uri, seeked);
            Frame.Navigate(typeof(Detail), response.FirstOrDefault());
        }

        async Task<List<Bid>> getSearchCallback(String uri, String param)
        {
            RestClient rc = new RestClient();
            rc.BaseUrl = uri;
            RestRequest request = new RestRequest();
            request.AddParameter("category.name",param);
            return await rc.ExecuteAsync<List<Bid>>(request);
        }

       async  private void takPic_click(object sender, RoutedEventArgs e)
        {
            //Create JPEG image Encoding format for storing image in JPEG type  
            ImageEncodingProperties imgFormat = ImageEncodingProperties.CreateJpeg();
            // create storage file in local app storage  
            StorageFile file = await ApplicationData.Current.LocalFolder.CreateFileAsync("Photo.jpg", CreationCollisionOption.ReplaceExisting);
            // take photo and store it on file location.  
            await captureManager.CapturePhotoToStorageFileAsync(imgFormat, file);
            //// create storage file in Picture Library  
            //StorageFile file = await KnownFolders.PicturesLibrary.CreateFileAsync("Photo.jpg",CreationCollisionOption.GenerateUniqueName);  
            // Get photo as a BitmapImage using storage file path.  
            BitmapImage bmpImage = new BitmapImage(new Uri(file.Path));
            await captureManager.StopPreviewAsync(); 
            // show captured image on Image UIElement.  
            imagePreivew.Source = bmpImage;
            this.startCam.Visibility = Visibility.Visible;
            this.takePicBtn.Visibility = Visibility.Collapsed;
            this.sendBtn.Visibility = Visibility.Visible;
            imagePreivew.Visibility = Visibility.Visible;
            
        }

        async private void send_click(object sender, RoutedEventArgs e)
        {
            TroubleTicket ticket = new TroubleTicket();
            ticket.creationDate = "2015-04-14T17:14:29UTC";
            ticket.description = "Troubles";
            ticket.note = new List<Note>();
            ticket.relatedParty = new List<RelatedParty>();
            ticket.type = "okation";
            ticket.severity = "High";
            ticket.status = "Submitted";
            ticket.targetResolutionDate = "2015-04-14T17:14:29UTC";
            ticket.relatedObject = new List<RelatedObject>();


            Geolocator geolocator = new Geolocator();
            geolocator.DesiredAccuracyInMeters = 50;
            Geoposition geoposition = await geolocator.GetGeopositionAsync(
                maximumAge: TimeSpan.FromMinutes(5),
                timeout: TimeSpan.FromSeconds(10)
                );

            RelatedObject lat = new RelatedObject();
            lat.involment="latitude";
            lat.reference=geoposition.Coordinate.Longitude.ToString("0.00");
            RelatedObject lng = new RelatedObject();
            lat.involment="longitude";
            lat.reference=geoposition.Coordinate.Latitude.ToString("0.00");
            ticket.relatedObject.Add(lat);
            ticket.relatedObject.Add(lng);
            var rest = new RestClient();
            var req = new RestRequest("http://env-0693795.jelastic.servint.net//DSTroubleTicket/api/troubleTicketManagement/v2/troubleTicket", HttpMethod.Post);
            req.AddHeader("Accept", "application/json");
            req.AddHeader("Content-Type", "application/json");
            req.AddParameter(Newtonsoft.Json.JsonConvert.SerializeObject(ticket));
            var result = await rest.ExecuteAsync<TroubleTicket>(req);
            result.ToString();
        }   

        async private void Start_Capture_Preview_Click(object sender, RoutedEventArgs e)
        {
            captureManager = new MediaCapture();    //Define MediaCapture object  
            await captureManager.InitializeAsync(new MediaCaptureInitializationSettings
            {
                StreamingCaptureMode = StreamingCaptureMode.Video,
                PhotoCaptureSource = PhotoCaptureSource.Photo,
                AudioDeviceId = string.Empty
            });
 
            capturePreview.Source = captureManager;   //Start preiving on CaptureElement  
            await captureManager.StartPreviewAsync();  //Start camera capturing   
            captureManager.SetPreviewRotation(VideoRotation.Clockwise90Degrees);
            captureManager.SetPreviewMirroring(false);
            this.startCam.Visibility = Visibility.Collapsed;
            this.takePicBtn.Visibility = Visibility.Visible;
            imagePreivew.Visibility = Visibility.Collapsed;
        }
    }
}
