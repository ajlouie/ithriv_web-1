import { Input } from '@angular/core';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Institution } from '../institution';
import { LoginService } from '../login-service';
import { fadeTransition } from '../shared/animations';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';

@Component({
  selector: 'app-login-services',
  templateUrl: './login-services.component.html',
  styleUrls: ['./login-services.component.scss'],
  animations: [fadeTransition()],
})
export class LoginServicesComponent implements OnInit {
  @Input() hidePublic: Boolean;
  loginServices: LoginService[] = [];
  loginUrl = environment.api.includes('localhost') ?
    environment.api + '/api/login' :
    environment.api + '/Shibboleth.sso/Login?target=' + environment.api + '/api/login&entityID=';
  institution: Institution;
  selectedTabIndex = 0;

  @HostBinding('@fadeTransition')
  dataLoaded = false;

  constructor(
    private api: ResourceApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedTabIndex = this.route.routeConfig.path === 'register' ? 1 : 0;
    this.loadServices();

    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty('institutionId')) {
        const instituttionId = parseInt(params['institutionId'], 10);
        this.api.getInstitution(instituttionId).subscribe((institution) => {
          this.institution = institution;
          sessionStorage.setItem('institution_name', institution.name);
        });
      }
    });
  }

  ngOnInit() {}

  goNetworkBrowse() {
    const viewPrefs = this.api.getViewPreferences();
    const isNetworkView =
      viewPrefs && viewPrefs.hasOwnProperty('isNetworkView')
        ? viewPrefs.isNetworkView
        : true;

    if (isNetworkView) {
      this.router.navigate(['network']);
    } else {
      this.router.navigate(['browse']);
    }
  }

  getInstitution() {
    if (sessionStorage.getItem('institution_id')) {
      this.api
        .getInstitution(parseInt(sessionStorage.getItem('institution_id'), 10))
        .subscribe((inst) => {
          this.institution = inst;
        });
    }
  }

  loadServices() {
    const services = [
      {
        id: null,
        color: 'orange',
        name: 'UVA',
        image: '/assets/institutions/UVA.png',
        url: environment.api.includes('localhost') ? this.loginUrl : this.loginUrl + 'urn:mace:incommon:virginia.edu',
      },
      {
        id: null,
        color: 'navy',
        name: 'Carilion',
        image: '/assets/institutions/Carilion.png',
        url: environment.api.includes('localhost') ? this.loginUrl : this.loginUrl + 'http://fs.carilionclinic.org/adfs/services/trust',
      },
      {
        id: null,
        color: 'purple',
        name: 'Virginia Tech',
        image: '/assets/institutions/Virginia Tech.png',
        url: environment.api.includes('localhost') ? this.loginUrl  : this.loginUrl + 'urn:mace:incommon:vt.edu',
      },
      {
        id: null,
        color: 'blue',
        name: 'Inova',
        image: '/assets/institutions/Inova.png',
        url: environment.api.includes('localhost') ? this.loginUrl : this.loginUrl + 'http://Fuchsia.inova.org/adfs/services/trust',
      },
      {
        id: null,
        color: 'black',
        name: 'VCU',
        image: '/assets/institutions/VCU.png',
        url: environment.api.includes('localhost') ? this.loginUrl : this.loginUrl + 'https://shibboleth.vcu.edu/idp/shibboleth',
      },
    ];

    if (this.hidePublic === undefined || this.hidePublic === false) {
      services.push({ id: null, color: 'green', name: 'Public', image: '', url: ''});
    }

    this.api.getInstitutions().subscribe((institutions) => {
      services.forEach((s) =>
        institutions.forEach((i) => {
          if (i.name === s.name && i.name !== 'Public') {
            s.id = i.id;
            this.loginServices.push(new LoginService(s));
          }
        })
      );

      institutions.forEach((i) =>
        services.forEach((s) => {
          if (i.name === s.name && i.name === 'Public') {
            s.id = i.id;
            this.loginServices.push(new LoginService(s));
          }
        })
      );

      this.dataLoaded = this.loginServices.length > 0;
    });
  }

  goLoginService(loginService: LoginService) {
    const institutionId = loginService.id.toString();
    sessionStorage.setItem('institution_id', institutionId);

    const onLoginScreen = /^\/login/.test(this.router.url);

    if (!onLoginScreen) {
      const prevUrl = this.router.url;
      localStorage.setItem('prev_url', prevUrl);
    }

    if (loginService.url) {
      window.location.href = loginService.url;
    } else if (loginService.name === 'Public') {
      this.router.navigate(['home'], { queryParams: { publicpage: true } });
    } else {
      this.router.navigate(['login'], {
        queryParams: { institutionId: institutionId },
      });
    }
  }
}
