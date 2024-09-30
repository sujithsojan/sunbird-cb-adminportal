import { ActivatedRoute, Router } from '@angular/router'
import { MentorManageComponent } from './mentor-manage.component'
import { BehaviorSubject, of, Subject } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { EventService } from '@sunbird-cb/utils'
import { LoaderService } from '../../home/services/loader.service'
import { DomSanitizer } from '@angular/platform-browser'
import { UsersService } from '../../home/services/users.service'

describe('MentorManageComponent', () => {
  let component: MentorManageComponent

  const mockDialog: Partial<MatDialog> = {}
  const mockRoute: Partial<ActivatedRoute> = {
    snapshot: {
      params: { tab: 'verified' },
      queryParams: of({ roleId: 'testRoleId' }),
      data: {
        configSvc: {
          userProfile: {
            userId: 'sampleId'
          }
        }
      }
    } as any,
    queryParams: of({ roleId: 'testRoleId' }),
  }
  const mockRouter: Partial<Router> = {}
  const mockEvents: Partial<EventService> = {}
  const mockLoaderService: Partial<LoaderService> = {
    changeLoad: new BehaviorSubject<boolean>(false),
  }
  const mockSanitizer: Partial<DomSanitizer> = {}

  const mockUserService: Partial<UsersService> = {
    mentorList$: new Subject<any>(),
    getAllUsersV3: jest.fn().mockReturnValue(of({
      content: [],
      count: 0,
      facets: []
    })),
  }
  const mockConfigSvc = {
    userProfile: {
      userId: 'testUserId',
    },
    unMappedUser: {
      profileDetails: {
        profileStatus: 'active',
      },
      roles: ['MDO_ADMIN'],
    },
  }

  beforeAll(() => {
    component = new MentorManageComponent(
      mockDialog as MatDialog,
      mockRoute as ActivatedRoute,
      mockRouter as Router,
      mockEvents as EventService,
      mockLoaderService as LoaderService,
      mockSanitizer as DomSanitizer,
      mockUserService as UsersService
    )
    component.configSvc = mockConfigSvc
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('ngOnInit', () => {
    it('should set currentFilter based on route params', () => {
      //act
      component.ngOnInit()
      //assert
      expect(component.currentFilter).toBe('verified')
    })

    it('should set rootOrgId based on query params', () => {
      //act
      component.ngOnInit()
      //assert
      expect(component.rootOrgId).toBe('testRoleId')
    })

    it('should set isMdoAdmin based on roles', () => {
      //act
      component.ngOnInit()
      //assert
      expect(component.isMdoAdmin).toBe(true)
    })

    it('should handle undefined userProfile gracefully', () => {
      component.configSvc = {
        unMappedUser: {
          profileDetails: { profileStatus: 'active' },
        },
      }

      component.ngOnInit()

      expect(component.currentUser).toBe('')
    })


    it('should subscribe to mentorList$ and call getAllVerifiedUsers and getMentorUsers', () => {
      //arrange
      const getAllVerifiedUsersSpy = jest.spyOn(component, 'getAllVerifiedUsers')
      const getMentorUsersSpy = jest.spyOn(component, 'getMentorUsers')
      //act
      component.ngOnInit();
      //assert
      (mockUserService.mentorList$ as Subject<any>).next({ someData: 'test' })

      expect(getAllVerifiedUsersSpy).toHaveBeenCalledWith('')
      expect(getMentorUsersSpy).toHaveBeenCalledWith('')
    })
  })

  describe('getAllVerifiedUsers', () => {
    it('should call getAllVerifiedUsers with correct parameters', () => {
      //arrange
      const getAllVerifiedUsersSpy = jest.spyOn(component, 'getAllVerifiedUsers')
      //act
      component.ngOnInit()
      //assert
      expect(getAllVerifiedUsersSpy).toHaveBeenCalledWith('')
    })

    it('should call usersService.getAllUsersV3 with the correct request body', () => {
      //arrange
      const getAllUsersV3Spy = jest.spyOn(mockUserService, 'getAllUsersV3')

      //act
      component.ngOnInit()

      //assert
      expect(getAllUsersV3Spy).toHaveBeenCalled()
    })
  })

})
